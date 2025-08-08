import React from 'react';
import { GameStateProvider } from './context/GameStateContext';
import AppRouter from './router';

function App() {
  return (
    <GameStateProvider>
      <AppRouter />
    </GameStateProvider>
  );
}

export default App;
