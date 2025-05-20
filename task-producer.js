const amqp = require('amqplib');

const rabbitmq_url = 'amqp://user:password@localhost';
const queue = 'calc_tasks';
const fanoutExchange = 'broadcast_tasks';

(async () => {
  const conn = await amqp.connect(rabbitmq_url);
  const channel = await conn.createChannel();

  await channel.assertQueue(queue, { durable: false });
  await channel.assertExchange(fanoutExchange, 'fanout', { durable: false });


  setInterval(() => {
    const ops = ['add', 'sub', 'mul', 'div', 'all'];
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 9) + 1;
    const op = ops[Math.floor(Math.random() * ops.length)];
    const message = JSON.stringify({ n1, n2, op });

    if (op === 'all') {
      channel.publish(fanoutExchange, '', Buffer.from(message));
      console.log(`[📡] Diffusé à tous les workers : ${message}`);
    } else {
      channel.sendToQueue(queue, Buffer.from(message));
      console.log(`[✓] Envoyé à un seul worker : ${message}`);
    }
  }, 5000);
})();
