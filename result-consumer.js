const amqp = require('amqplib');
const rabbitmq_url = 'amqp://user:password@localhost';
const queue = 'calc_results';

(async () => {
  const conn = await amqp.connect(rabbitmq_url);
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: false });

  console.log('📨 Attente des résultats...');

  channel.consume(queue, (msg) => {
    const res = JSON.parse(msg.content.toString());
    console.log(`✅ Résultat reçu : ${JSON.stringify(res)}`);
    channel.ack(msg);
  });
})();
