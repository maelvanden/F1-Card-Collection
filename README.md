# F1-Card-Collection

Jeu de carte F1.

## Installation

### Prérequis
- [Node.js](https://nodejs.org/) 18 ou supérieur
- npm

### Étapes
```bash
git clone <url>
cd F1-Card-Collection
npm install
```

### Configuration

Avant de démarrer le serveur, vous devez définir certaines variables d'environnement :

```bash
export JWT_SECRET=mon-super-secret
export ALLOWED_ORIGINS="https://mon-domaine.com,https://admin.mon-domaine.com"
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=f1cards
export MYSQL_USER=f1cards
export MYSQL_PASSWORD=secret
export PORT=3000
npm run server
```

`JWT_SECRET` est le secret utilisé pour signer les tokens JWT.

`ALLOWED_ORIGINS` définit la liste des origines autorisées par CORS (séparées par des virgules). Pour autoriser plusieurs origines, séparez-les par des virgules, par exemple : `https://mon-domaine.com,https://admin.mon-domaine.com`. Si elle n'est pas définie, `http://localhost:5173` est utilisée par défaut.

`MYSQL_HOST` spécifie l'hôte du serveur MySQL.

`MYSQL_PORT` indique le port du serveur MySQL (3306 par défaut).

`MYSQL_DATABASE` correspond au nom de la base de données MySQL à utiliser.

`MYSQL_USER` est l'utilisateur ayant accès à la base MySQL.

`MYSQL_PASSWORD` est le mot de passe de cet utilisateur MySQL.

`PORT` définit le port d'écoute du serveur. La valeur par défaut est `3000`.

`DIST_PATH` (facultatif) indique le chemin vers le dossier des fichiers compilés. S'il est laissé vide ou non défini, le serveur utilisera `../dist` par défaut.

## Scripts

- `npm run dev` : démarre un serveur de développement avec rechargement à chaud.
- `npm run build` : génère la version de production dans le dossier `dist/`.
- `npm run preview` : lance un serveur pour prévisualiser la version de production.
- `npm start` : exécute `npm run build` puis lance le serveur qui sert `dist/`.
- `npm test` : exécute les tests unitaires avec Vitest.

## Déploiement sur un même hébergeur

Le serveur Express sert les fichiers statiques générés dans `dist/` et renvoie
`index.html` pour toute route non API. Pour un déploiement sur un même
hébergeur, exécutez simplement :

```bash
npm start
```

Cette commande compile le frontend (`npm run build`) puis démarre le serveur en
production.

## Déploiement sur Hostinger

Sur Hostinger, définissez les variables d'environnement depuis le panneau **Advanced > Environment variables** ou via la ligne de commande. Assurez-vous notamment de configurer `ALLOWED_ORIGINS` avec votre domaine :

```bash
export ALLOWED_ORIGINS="https://f1cardcollection.mvcraft.fr"
```

Pour autoriser plusieurs domaines, séparez-les par des virgules :

```bash
export ALLOWED_ORIGINS="https://f1cardcollection.mvcraft.fr,https://admin.f1cards.fr"
```

Les variables `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` et `MYSQL_PASSWORD` doivent correspondre aux paramètres de votre base MySQL Hostinger. Elles permettent au serveur de se connecter à la base pour stocker les utilisateurs.

Avant de lancer l'application, créez la table `users` :

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  speedCoins INT DEFAULT 0,
  registrationDate VARCHAR(255),
  avatarUrl VARCHAR(255),
  bannerUrl VARCHAR(255),
  bio TEXT
);
```

Ensuite, démarrez l'application avec :

```bash
npm start
```

Cette commande construit le frontend et lance le serveur en production.

## Déploiement sur Render

Pour déployer sur [Render](https://render.com/), configurez le service web avec :

- **Build command** : `npm run build`
- **Start command** : `node server/index.js` (ou `npm run start` si la construction est incluse)

Laissez la variable d'environnement `DIST_PATH` vide afin que le serveur serve par défaut le dossier `../dist`.

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue pour discuter d'une nouvelle fonctionnalité ou corriger un bug, puis proposez une pull request.
