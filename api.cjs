const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const RABBIT_URL = 'amqp://user:password@efrei20250519.hopto.org:5681';
const REQUEST_QUEUE = 'calc_requests';

let channel, connection;

async function start() {
  connection = await amqp.connect(RABBIT_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(REQUEST_QUEUE, { durable: false });
}

app.post('/calc', async (req, res) => {
  try {
    const { n1, n2, op } = req.body;
    if (typeof n1 !== "number" || typeof n2 !== "number" || !["add","sub","mul","div"].includes(op)) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }

    const correlationId = uuidv4();
    const replyQueue = await channel.assertQueue('', { exclusive: true });

    channel.sendToQueue(REQUEST_QUEUE, Buffer.from(JSON.stringify({ n1, n2, op })), {
      correlationId,
      replyTo: replyQueue.queue
    });

    // Timeout de 20 sec si pas de réponse
    const timeout = setTimeout(() => {
      res.status(504).json({ error: 'Timeout' });
    }, 20000);

    channel.consume(replyQueue.queue, (msg) => {
      if (msg && msg.properties.correlationId === correlationId) {
        clearTimeout(timeout);
        const result = JSON.parse(msg.content.toString());
        res.json(result);
        channel.deleteQueue(replyQueue.queue); // Nettoyage
      }
    }, { noAck: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

start().then(() => {
  app.listen(3000, () => console.log('API en écoute sur http://localhost:3000'));
});
