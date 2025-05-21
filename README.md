# Calcul Distribué RabbitMQ - Jie FAN, Minh Quang, Mohamed Rida, Loris Labarre

---

## 📦 Prérequis

- [Node.js v18+](https://nodejs.org/) — testé avec les versions 18 et 20
- [Docker](https://www.docker.com/) — pour exécuter RabbitMQ
- [npm](https://www.npmjs.com/) — gestionnaire de paquets Node.js

---

## 🚀 Lancement rapide

Clone le repo :
 
git clone [REPO_GIT](https://github.com/Quanghng/rabbitmq-worker)
cd [rabbitmq-worker]

### 1. Lancer RabbitMQ en local

```
docker compose up -d
```

- Interface Web RabbitMQ disponible sur :  
  👉 [http://localhost:15672](http://localhost:15672)  
  (user : `user` / password : `password`)

- Port AMQP : `localhost:5672`

---

### 2. Lancer le backend (Express + WebSocket + AMQP +  Workers)

```
cd backend
npm install
node api.cjs
```

- L'API écoute sur :  
  👉 [http://localhost:3000](http://localhost:3000)

- Les résultats sont poussés en temps réel via WebSocket sur `/ws/results`

---

### 3. Lancer le frontend (Vue.js) en mode dev

```
cd frontend
npm install
npm run dev
```

- L'interface est accessible sur :  
  👉 [http://localhost:5173](http://localhost:5173)

- Communication avec le backend via le port `3000`

---

### 4. Lancer les workers

Lancer un worker par opération dans des terminaux séparés :

```
node worker.cjs add
node worker.cjs sub
node worker.cjs mul
node worker.cjs div
```

---

👉 L’application complète est servie depuis :  
[http://localhost:3000](http://localhost:3000)  
Plus besoin de lancer le frontend séparément en mode dev.

---

## ✨ Fonctionnalités

- Frontend **Vue.js + Tailwind CSS**
- Envoi **manuel ou automatique** d’opérations :
  - `add`, `sub`, `mul`, `div`, `all`
- Résultats en **temps réel**
- **Admin panel** :
  - Visualisation du nombre de workers
  - Statut en temps réel
  - Nombre d’opérations traitées
- RabbitMQ entièrement **dockerisé**

---

## Architecture
 
╔══════════════════╗
║  Utilisateur     ║
║ (Postman, Web)   ║
╚═════╦════════════╝
      │ 1. HTTP POST (n1, n2, op)
      ▼
╔══════════════════════════════════════════╗
║               api.cjs (Express)         ║
╠══════════════════════════════════════════╣
║ - Vérifie les entrées                   ║
║ - Génère correlationId + replyTo        ║
║ - Publie la requête dans l'exchange     ║
║ - Attend (1 ou 4) réponses sur replyTo  ║
║ - Rassemble et répond à l'utilisateur   ║
╚══════════════════════════════════════════╝
      │ 2. AMQP publish
      ▼
╔══════════════════════════════════════════╗
║         RabbitMQ EXCHANGE (direct)      ║
║           "calc_exchange"               ║
╚══════════════════════════════════════════╝
      │
      ├─────[RoutingKey: add]────────────┬─────────────[Queue: "add"]───▶ Worker add
      │                                  │
      ├─────[RoutingKey: sub]────────────┴─────────────[Queue: "sub"]───▶ Worker sub
      │                                  │
      ├─────[RoutingKey: mul]────────────┴─────────────[Queue: "mul"]───▶ Worker mul
      │                                  │
      ├─────[RoutingKey: div]────────────┴─────────────[Queue: "div"]───▶ Worker div
      │                                  │
      └─────[RoutingKey: all]────────────┬─────────────[Binding supplémentaire sur TOUTES les queues]
                                         │            (chaque queue écoute aussi "all")
                                         ▼
╔══════════════════════════════════════════╗
║    Les 4 queues ("add", "sub", ...)     ║
║    (Chacune liée à son op + à "all")    ║
╚══════════════════════════════════════════╝
      │
      │ 3. AMQP consume (worker lit sa queue)
      ▼
╔══════════════════════════════════════════╗
║           worker.cjs (spécialisé)       ║
╠══════════════════════════════════════════╣
║ - Décode n1, n2, op                     ║
║ - Calcule le résultat                   ║
║ - Attend 5-15 sec                       ║
║ - Répond sur la queue replyTo           ║
║   (via correlationId)                   ║
╚══════════════════════════════════════════╝
      │ 4. Réponse AMQP sur queue temporaire
      ▼
╔══════════════════════════════════════════╗
║       api.cjs (récolte les réponses)    ║
╠══════════════════════════════════════════╣
║ - Associe les réponses par correlationId║
║ - Attend 1 réponse (op simple)          ║
║ - Attend 4 réponses (op "all")          ║
║ - Supprime la queue temporaire          ║
║ - Répond HTTP au client                 ║
╚══════════════════════════════════════════╝
      │ 5. HTTP response (résultat)
      ▼
╔══════════════════╗
║  Utilisateur     ║
╚══════════════════╝
 
────────────
En //, tu peux avoir :
╔══════════════════╗
║  producer.cjs    ║
╠══════════════════╣
║ - Génère des jobs
║ - Publie directement sur "calc_exchange" avec op aléatoire
║ - N'attend PAS de réponse (test load)
╚══════════════════╝

