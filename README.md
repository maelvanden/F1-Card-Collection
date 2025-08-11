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

Avant de démarrer le serveur, vous devez définir la variable d'environnement `JWT_SECRET` utilisée pour signer les jetons JWT.
Par exemple :

```bash
export JWT_SECRET=mon-super-secret
npm run server
```

## Scripts

- `npm run dev` : démarre un serveur de développement avec rechargement à chaud.
- `npm run build` : génère la version de production dans le dossier `dist/`.
- `npm run preview` : lance un serveur pour prévisualiser la version de production.
- `npm test` : exécute les tests unitaires avec Vitest.

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue pour discuter d'une nouvelle fonctionnalité ou corriger un bug, puis proposez une pull request.
