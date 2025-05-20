const amqp = require('amqplib');

const QUEUE = 'calc_requests';

const operations = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => b !== 0 ? a / b : null
};

async function startWorker() {
  const conn = await amqp.connect('amqp://user:password@efrei20250519.hopto.org:5681');
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: false });

  channel.consume(QUEUE, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      const opFunc = operations[data.op];
      let result = null;
      if (opFunc) {
        // Simule calcul complexe (5 à 15 secondes)
        const delay = Math.floor(5000 + Math.random() * 10000);
        await new Promise(res => setTimeout(res, delay));
        result = opFunc(data.n1, data.n2);
      }
      const response = { ...data, result };

      // Répondre via la queue replyTo + correlationId pour API RPC
      if (msg.properties.replyTo) {
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          { correlationId: msg.properties.correlationId }
        );
      }
      channel.ack(msg);

      console.log(`Calcul effectué pour ${data.op} : ${data.n1}, ${data.n2} => ${result}`);
    }
  });
}

startWorker().catch(console.error);
