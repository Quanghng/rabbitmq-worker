# 🧠 Calcul Distribué RabbitMQ – Frontend Vue.js

## 📌 Présentation

Ce projet constitue la partie **frontend** du système de calcul distribué basé sur **RabbitMQ**, développé dans le cadre du module *Calcul Distribué* (EFREI / NGI).

- Vue.js + TailwindCSS (mode sombre natif)
- Résultats en temps réel via WebSocket *(mocké pour la démo)*
- Mode envoi manuel et automatique d’opérations aléatoires
- Admin Panel affichant l’état des workers et des statistiques

---

## 🚀 Fonctionnalités

- Envoyer des calculs (`add`, `sub`, `mul`, `div`, `all`) via formulaire
- Mode automatique : envoi toutes les 5s d’opérations aléatoires
- Affichage des résultats : mise à jour en temps réel (WebSocket ou mock)
- Panel d’administration :
  - Nombre de workers
  - Statut des workers
  - Nombre d’opérations traitées
- Mode sombre natif avec Tailwind CSS (CDN)
- Interface responsive (PC / tablette / smartphone)

---

## ⚙️ Installation & Lancement

### 1. Cloner le dépôt

```
git clone <url-du-repo>
cd frontend
```

### 2. Installer les dépendances

```
npm install
```

### 3. Lancer le projet

```
npm run dev
```

Accéder ensuite à :  
👉 http://localhost:5173 *(ou le port indiqué dans la console)*

---

## 🧩 API / Backend attendu

- **POST** `/api/operation`  
  Envoie une opération à traiter  
  → *Voir le format JSON dans l’énoncé du projet*

- **WebSocket** `/ws/results`  
  Réception des résultats de calcul en temps réel

- *(Optionnel)* **WebSocket** `/ws/admin`  
  Statistiques workers à afficher dans l'Admin Panel

> 💡 Pour la démo, tout est mocké côté frontend mais l’interface est **prête à brancher** dès que le backend est opérationnel.

---

## 🖼️ Exemple d’interface

📷 *Ajoutez ici une capture d’écran du projet (pour soutenance ou documentation).*

---

## 📋 À compléter

- 👥 **Équipe / Auteurs**  
  → Réalisé par **Lolo & co**

- 🗺️ Ajouter un **schéma d’architecture** si demandé

- 🔌 Détailler la **connexion avec le backend** (Python, Node…)

- 🎥 Ajouter une **vidéo de démonstration** ou d'autres screenshots

---

## 🛠️ Réalisation

**Mohamed Rida, Minh Quang, Jie FAN, Loris LABARRE  – EFREI - – Module Calcul Distribué**
