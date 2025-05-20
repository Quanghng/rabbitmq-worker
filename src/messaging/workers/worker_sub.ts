import amqp from 'amqplib';
import { sleep } from '../../utils/helpers';

const RABBITMQ_URL = 'amqp://user:password@localhost:5672';
const EXCHANGE_NAME = 'task_exchange';
const RESULT_QUEUE = 'result_queue';
const OPERATION = 'sub';
const TASK_QUEUE = `task_${OPERATION}_queue`;

let channel: amqp.Channel;

async function startWorker() {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

  await channel.assertQueue(TASK_QUEUE, { durable: true });
  await channel.bindQueue(TASK_QUEUE, EXCHANGE_NAME, OPERATION);

  await channel.assertQueue(RESULT_QUEUE, { durable: true });

  channel.prefetch(1);

  console.log(` [*] Waiting for '${OPERATION}' tasks in ${TASK_QUEUE}. To exit press CTRL+C`);

  channel.consume(TASK_QUEUE, consume, { noAck: false });
}

async function consume(message: any) {
  if (!message) return;

  try {
    const content = message.content.toString();
    const data = JSON.parse(content) as { n1: number; n2: number };

    console.log(` [x] Received: ${content}`);

    await sleep();

    const result = data.n1 - data.n2;

    const resultMessage = {
      n1: data.n1,
      n2: data.n2,
      op: OPERATION,
      result,
    };

    channel.sendToQueue(RESULT_QUEUE, Buffer.from(JSON.stringify(resultMessage)), {
      persistent: true,
    });

    console.log(` [✓] Sent result: ${JSON.stringify(resultMessage)}`);

    channel.ack(message);
  } catch (err) {
    console.error(' [!] Error:', err);
    channel.nack(message, false, false);
  }
}

startWorker().catch(console.error);
