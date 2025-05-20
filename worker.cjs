const amqp = require('amqplib');
const EXCHANGE = 'calc_exchange';

// Opération en paramètre de ligne de commande : add, sub, mul, div
const op = process.argv[2] || 'add';

const operations = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => b !== 0 ? a / b : null
};

async function startWorker() {
  const conn = await amqp.connect('amqp://user:password@efrei20250519.hopto.org:5681');
  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, 'direct', { durable: false });
  await channel.assertQueue(op, { durable: false });
  await channel.bindQueue(op, EXCHANGE, op);

  channel.consume(op, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      const opFunc = operations[op];
      let result = null;
      if (opFunc) {
        // Simule un calcul long
        const delay = Math.floor(5000 + Math.random() * 10000);
        await new Promise(res => setTimeout(res, delay));
        result = opFunc(data.n1, data.n2);
      }
      const response = { ...data, result };

      // Réponse via replyTo/correlationId pour l'API
      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(response)),
        { correlationId: msg.properties.correlationId }
      );
      console.log(`Worker ${op} : calcul fait et réponse envoyée`, response);
      channel.ack(msg);
    }
  });
}

startWorker();
