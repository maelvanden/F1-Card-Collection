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
export ALLOWED_ORIGINS=https://exemple.com,http://localhost:5173
export DB_PATH=/var/lib/f1-card-collection/data.sqlite
npm run server
```

`ALLOWED_ORIGINS` définit la liste des origines autorisées par CORS (séparées par des virgules).
Si elle n'est pas définie, `http://localhost:5173` est utilisée par défaut.

`DB_PATH` définit le chemin du fichier SQLite. Il vaut `data.sqlite` par défaut et doit pointer vers un emplacement persistant en production, par exemple `/var/lib/f1-card-collection/data.sqlite`.

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

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue pour discuter d'une nouvelle fonctionnalité ou corriger un bug, puis proposez une pull request.
