// Chargement de la librairie amqplib
const amqp = require('amqplib');

// Définition des informations de connexion
const rabbitmq_url = 'amqp://user:password@localhost';

// Récupération de l'opération à traiter (ex: node task-consumer.js add)
const operation = process.argv[2];

// Définition des noms de queues et exchange
const inputQueue = 'calc_tasks';           // queue classique
const resultQueue = 'calc_results';        // queue de résultats
const fanoutExchange = 'broadcast_tasks';  // exchange de type fanout

// Fonction principale
async function receive() {
  const conn = await amqp.connect(rabbitmq_url);
  const channel = await conn.createChannel();

  // Assertion des queues et de l’exchange
  await channel.assertQueue(inputQueue, { durable: false });
  await channel.assertQueue(resultQueue, { durable: false });
  await channel.assertExchange(fanoutExchange, 'fanout', { durable: false });

  // 1️⃣ Consommation des tâches classiques depuis la queue directe
  channel.consume(inputQueue, (message) => {
    handleTask(channel, message);
  });

  // 2️⃣ Abonnement à l’exchange fanout via une queue temporaire (exclusive)
  const tempQueue = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(tempQueue.queue, fanoutExchange, '');

  channel.consume(tempQueue.queue, (message) => {
    handleTask(channel, message);
  });

  console.log(`🛠️ Worker "${operation}" prêt à traiter les tâches (direct + fanout)`);
}

// Fonction de traitement d’un message
async function handleTask(channel, message) {
  if (!message) return;

  const task = JSON.parse(message.content.toString());

  // Filtrage : ce worker ne traite que sa propre opération ou les tâches "all"
  if (task.op !== operation && task.op !== 'all') {
    channel.ack(message);
    return;
  }

  console.log(`📥 Tâche reçue (${operation}) : ${JSON.stringify(task)}`);

  // Simuler un calcul long (entre 5 et 15 secondes)
  const wait = Math.floor(Math.random() * 10) + 5;
  await new Promise(resolve => setTimeout(resolve, wait * 1000));

  let result;
  switch (operation) {
    case 'add': result = task.n1 + task.n2; break;
    case 'sub': result = task.n1 - task.n2; break;
    case 'mul': result = task.n1 * task.n2; break;
    case 'div': result = task.n1 / task.n2; break;
    default:
      console.error("❌ Opération inconnue");
      channel.ack(message);
      return;
  }

  const output = {
    ...task,
    result,
    handledBy: operation  // Ajoute le type de worker qui a traité la tâche
  };

  channel.sendToQueue(resultQueue, Buffer.from(JSON.stringify(output)));
  console.log(`📤 Résultat envoyé : ${JSON.stringify(output)}`);

  channel.ack(message);
}

// Lancer le worker
receive();
