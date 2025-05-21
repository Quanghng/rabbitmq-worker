const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json());

const RABBIT_URL = 'amqp://user:password@localhost:5672';
const EXCHANGE = 'calc_exchange';

let channel, connection;
const workerStatusMap = new Map();


async function start() {
  connection = await amqp.connect(RABBIT_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'direct', { durable: false });
  
  // Status queue for workers
  await channel.assertQueue('worker_status', { durable: false });
  channel.consume('worker_status', (msg) => {
    const status = JSON.parse(msg.content.toString());
    status.lastSeen = Date.now();
    workerStatusMap.set(status.id, status);
  });
}

app.post('/calc', async (req, res) => {
  try {
    const { n1, n2, op } = req.body;
    if (typeof n1 !== "number" || typeof n2 !== "number" || !["add", "sub", "mul", "div", "all"].includes(op)) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }

    const correlationId = uuidv4();
    const replyQueue = await channel.assertQueue('', { exclusive: true });

    channel.publish(EXCHANGE, op, Buffer.from(JSON.stringify({ n1, n2, op })), {
      correlationId,
      replyTo: replyQueue.queue
    });

    const expectedResponses = (op === "all") ? 4 : 1;
    const results = [];
    let responded = false;

    // Timeout de 20 sec si pas de réponse(s)
    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(504).json({ error: 'Timeout', results });
        channel.deleteQueue(replyQueue.queue);
      }
    }, 20000);

    channel.consume(replyQueue.queue, (msg) => {
      if (msg && msg.properties.correlationId === correlationId && !responded) {
        const result = JSON.parse(msg.content.toString());
        results.push(result);

        // Pour "all", il faut 4 réponses
        if (results.length >= expectedResponses) {
          responded = true;
          clearTimeout(timeout);
          res.json(results);
          channel.deleteQueue(replyQueue.queue);
        }
      }
    }, { noAck: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get workers status
app.get('/workers', (req, res) => {
  const now = Date.now();
  const list = Array.from(workerStatusMap.values()).map(w => ({
    ...w,
    up: now - w.lastSeen < 10000 // if not heard from in last 10s → down
  }));
  res.json(list);
});


start().then(() => {
  app.listen(3000, () => console.log('API en écoute sur http://localhost:3000'));
});
