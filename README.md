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
npm run server
```

`ALLOWED_ORIGINS` définit la liste des origines autorisées par CORS (séparées par des virgules).
Si elle n'est pas définie, `http://localhost:5173` est utilisée par défaut.

## Scripts

- `npm run dev` : démarre un serveur de développement avec rechargement à chaud.
- `npm run build` : génère la version de production dans le dossier `dist/`.
- `npm run preview` : lance un serveur pour prévisualiser la version de production.
- `npm test` : exécute les tests unitaires avec Vitest.

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue pour discuter d'une nouvelle fonctionnalité ou corriger un bug, puis proposez une pull request.
