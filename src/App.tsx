import React from 'react';
import { GameStateProvider } from './context/GameStateContext';
import AppRouter from './router';
import AchievementToast from './components/ui/AchievementToast';

function App() {
  return (
    <GameStateProvider>
      <AppRouter />
      <AchievementToast />
    </GameStateProvider>
  );
}

export default App;
