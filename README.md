# Calcul Distribué RabbitMQ - Jie FAN, Minh Quang, Mohamed Rida, Loris Labarre

---

## 📦 Prérequis

- [Node.js v18+](https://nodejs.org/) — testé avec les versions 18 et 20
- [Docker](https://www.docker.com/) — pour exécuter RabbitMQ
- [npm](https://www.npmjs.com/) — gestionnaire de paquets Node.js

---

## 🚀 Lancement rapide

Clone le repo :
 
git clone https://github.com/Quanghng/rabbitmq-worker
cd rabbitmq-worker

### 1. Lancer RabbitMQ en local

```
docker compose up -d
```

- Interface Web RabbitMQ disponible sur :  
  👉 [http://localhost:15672](http://localhost:15672)  
  (user : `user` / password : `password`)

- Port AMQP : `localhost:5672`

---

### 2. Lancer le backend

```
cd backend
npm install
node api.cjs
```

- L'API écoute sur :  
  👉 [http://localhost:3000](http://localhost:3000)

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

---

## ✨ Fonctionnalités

- Frontend **Vue.js**
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
 
![image](https://github.com/user-attachments/assets/5075f216-88bc-415a-85ec-8f02883e234a)


