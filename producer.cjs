const amqp = require('amqplib');
const exchange = 'calc_exchange';

async function send() {
  const conn = await amqp.connect('amqp://user:password@efrei20250519.hopto.org:5681');
  const channel = await conn.createChannel();
  await channel.assertExchange(exchange, 'direct', { durable: false });

  // Exemple d'envoi de 4 opérations différentes :
  const ops = ['add', 'sub', 'mul', 'div'];
  setInterval(() => {
    const n1 = Math.floor(Math.random() * 100);
    const n2 = Math.floor(Math.random() * 100);
    const op = ops[Math.floor(Math.random() * ops.length)];
    const msg = JSON.stringify({ n1, n2, op });
    channel.publish(exchange, op, Buffer.from(msg));
    console.log(`Envoyé à l'exchange : ${msg}`);
  }, 5000);
}

send();
