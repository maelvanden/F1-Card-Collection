import React, { createContext, useState, useEffect } from 'react';
import { GameState, User, Card } from '../types';
import { sampleCards } from '../data/mockData';

interface GameStateContextType {
  gameState: GameState;
  login: (user: User) => void;
  logout: () => void;
  updateSpeedCoins: (amount: number) => void;
  addCards: (cards: Card[]) => void;
  removeCard: (cardId: string) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    user: null,
    userCards: [],
    speedCoins: 0,
    isAuthenticated: false
  });

  useEffect(() => {
    const savedState = localStorage.getItem('f1-game-state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('f1-game-state', JSON.stringify(gameState));
  }, [gameState]);

  const login = (user: User) => {
    setGameState(prev => ({
      ...prev,
      user,
      speedCoins: user.speedCoins,
      userCards: sampleCards,
      isAuthenticated: true
    }));
  };

  const logout = () => {
    setGameState({
      user: null,
      userCards: [],
      speedCoins: 0,
      isAuthenticated: false
    });
    localStorage.removeItem('f1-game-state');
  };

  const updateSpeedCoins = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      speedCoins: prev.speedCoins + amount,
      user: prev.user ? { ...prev.user, speedCoins: prev.speedCoins + amount } : null
    }));
  };

  const addCards = (cards: Card[]) => {
    setGameState(prev => ({
      ...prev,
      userCards: [...prev.userCards, ...cards]
    }));
  };

  const removeCard = (cardId: string) => {
    setGameState(prev => ({
      ...prev,
      userCards: prev.userCards.filter(card => card.id !== cardId)
    }));
  };

  return (
    <GameStateContext.Provider value={{ gameState, login, logout, updateSpeedCoins, addCards, removeCard }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContext;
