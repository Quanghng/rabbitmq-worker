const amqp = require('amqplib');
const exchange = 'calc_exchange';

async function send() {
  const conn = await amqp.connect('amqp://user:password@localhost:5672');
  const channel = await conn.createChannel();
  await channel.assertExchange(exchange, 'direct', { durable: false });

  const ops = ['add', 'sub', 'mul', 'div', 'all'];
  setInterval(() => {
    const n1 = Math.floor(Math.random() * 100);
    const n2 = Math.floor(Math.random() * 100);
    const op = ops[Math.floor(Math.random() * ops.length)];
    const msg = JSON.stringify({ n1, n2, op });
    channel.publish(exchange, op, Buffer.from(msg));
    console.log(`Envoyé à l'exchange : ${msg}`);
  }, 3000);
}

send();
