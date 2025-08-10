import React, { createContext, useState, useEffect } from 'react';
import { GameState, User, Card, Achievement } from '../types';
import { sampleCards } from '../data/mockData';
import { defaultAchievements } from '../data/achievements';

interface GameStateContextType {
  gameState: GameState;
  achievements: Achievement[];
  login: (user: User) => void;
  logout: () => void;
  updateSpeedCoins: (amount: number) => void;
  addCards: (cards: Card[]) => void;
  removeCard: (cardId: string) => void;
  unlockAchievement: (id: string) => void;
  resetDailyChallenges: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    user: null,
    userCards: [],
    speedCoins: 0,
    isAuthenticated: false
  });
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);

  useEffect(() => {
    const savedState = localStorage.getItem('f1-game-state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState(parsed);
    }
    const savedAchievements = localStorage.getItem('f1-achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('f1-game-state', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('f1-achievements', JSON.stringify(achievements));
  }, [achievements]);

  const resetDailyChallenges = () => {
    setAchievements(prev => prev.map(a => ({ ...a, progress: 0, unlocked: false })));
    localStorage.setItem('f1-last-reset', new Date().toDateString());
  };

  useEffect(() => {
    const lastReset = localStorage.getItem('f1-last-reset');
    const today = new Date().toDateString();
    if (lastReset !== today) {
      resetDailyChallenges();
    }
  }, []);

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

  useEffect(() => {
    const cardCount = gameState.userCards.length;
    setAchievements(prev =>
      prev.map(a =>
        a.id === 'ten_cards'
          ? {
              ...a,
              progress: Math.min((cardCount / 10) * 100, 100),
              unlocked: a.unlocked || cardCount >= 10,
            }
          : a
      )
    );
  }, [gameState.userCards.length]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(a =>
        a.id === id ? { ...a, progress: 100, unlocked: true } : a
      )
    );
  };

  return (
    <GameStateContext.Provider value={{ gameState, achievements, login, logout, updateSpeedCoins, addCards, removeCard, unlockAchievement, resetDailyChallenges }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContext;
