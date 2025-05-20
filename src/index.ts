import express, { Request, Response } from 'express';
import amqp from 'amqplib';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const RABBITMQ_URL = 'amqp://user:password@localhost:5672';
const EXCHANGE_NAME = 'task_exchange';
const RESULT_QUEUE = 'result_queue';

const conn = await amqp.connect(RABBITMQ_URL);
const channel = await conn.createChannel();

app.post('/calcul', async (req: Request, res: Response) => {
  const { op } = req.body;
  const msgBuffer = Buffer.from(JSON.stringify(req.body));
  channel.publish(EXCHANGE_NAME, op, msgBuffer, { persistent: true });
  console.log(`[→] Sent to '${op}': ${JSON.stringify(msgBuffer)}`);
});

// When a client connects to websocket
io.on('connection', (socket) => {
  console.log('Client connected');

  // Consume from RabbitMQ and emit to connected clients
  channel.consume(RESULT_QUEUE, (msg) => {
    if (msg) {
      const result = JSON.parse(msg.content.toString());
      socket.emit('newResult', result);
      channel.ack(msg);
    }
  });
});

app.listen(3000, () => {
  console.log('Calculation server listening on http://localhost:3000');
});
