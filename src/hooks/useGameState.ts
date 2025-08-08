import { useContext } from 'react';
import GameStateContext from '../context/GameStateContext';

export const useGameStateContext = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
};
