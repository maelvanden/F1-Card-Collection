import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { GameState, User, Card, Achievement } from '../types';
import { sampleCards } from '../data/mockData';
import { defaultAchievements } from '../data/achievements';
import { defaultDailyAchievements } from '../data/dailyAchievements';

interface GameStateContextType {
  gameState: GameState;
  achievements: Achievement[];
  dailyAchievements: Achievement[];
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
  updateSpeedCoins: (amount: number) => void;
  addCards: (cards: Card[]) => void;
  removeCard: (cardId: string) => void;
  unlockAchievement: (id: string, type?: 'daily' | 'normal') => void;
  claimAchievementReward: (id: string, type?: 'daily' | 'normal') => void;
  resetDailyChallenges: () => void;
  incrementPacksOpened: () => void;
  incrementCardsPurchased: () => void;
  lastUnlockedAchievement: Achievement | null;
  clearLastAchievement: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    user: null,
    userCards: [],
    speedCoins: 0,
    packsOpened: 0,
    cardsPurchased: 0,
    isAuthenticated: false,
    token: null
  });
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [dailyAchievements, setDailyAchievements] = useState<Achievement[]>(defaultDailyAchievements);
  const [lastUnlockedAchievement, setLastUnlockedAchievement] = useState<Achievement | null>(null);
  const unlockedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const savedState = localStorage.getItem('f1-game-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState({ packsOpened: 0, cardsPurchased: 0, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved game state', error);
      }
    }
    const savedAchievements = localStorage.getItem('f1-achievements');
    if (savedAchievements) {
      try {
        const parsedAchievements: Achievement[] = JSON.parse(savedAchievements);
        setAchievements(parsedAchievements.map(a => ({ rewardClaimed: false, ...a })));
      } catch (error) {
        console.error('Failed to parse achievements', error);
      }
    }
    const savedDaily = localStorage.getItem('f1-daily-achievements');
    if (savedDaily) {
      try {
        const parsedDaily: Achievement[] = JSON.parse(savedDaily);
        setDailyAchievements(parsedDaily.map(a => ({ rewardClaimed: false, ...a })));
      } catch (error) {
        console.error('Failed to parse daily achievements', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('f1-game-state', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('f1-achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('f1-daily-achievements', JSON.stringify(dailyAchievements));
  }, [dailyAchievements]);
  useEffect(() => {
    const combined = [...achievements, ...dailyAchievements];
    if (Object.keys(unlockedRef.current).length === 0) {
      combined.forEach(a => {
        unlockedRef.current[a.id] = a.unlocked;
      });
      return;
    }
    combined.forEach(a => {
      const wasUnlocked = unlockedRef.current[a.id];
      if (a.unlocked && !wasUnlocked) {
        setLastUnlockedAchievement(a);
      }
      unlockedRef.current[a.id] = a.unlocked;
    });
  }, [achievements, dailyAchievements]);
  const clearLastAchievement = () => setLastUnlockedAchievement(null);
  const getParisDateString = () =>
    new Date().toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

  const resetDailyChallenges = useCallback(() => {
    setDailyAchievements(prev => prev.map(a => ({ ...a, progress: 0, unlocked: false, rewardClaimed: false })));
    localStorage.setItem('f1-last-reset', getParisDateString());
  }, []);

  useEffect(() => {
    const lastReset = localStorage.getItem('f1-last-reset');
    const today = getParisDateString();
    if (lastReset !== today) {
      resetDailyChallenges();
    }
  }, [resetDailyChallenges]);

  const login = ({ user, token }: { user: User; token: string }) => {
    localStorage.setItem('authToken', token);
    setGameState(prev => ({
      ...prev,
      user,
      speedCoins: user.speedCoins,
      userCards: sampleCards,
      packsOpened: 0,
      cardsPurchased: 0,
      isAuthenticated: true,
      token
    }));
  };

  const logout = () => {
    setGameState({
      user: null,
      userCards: [],
      speedCoins: 0,
      packsOpened: 0,
      cardsPurchased: 0,
      isAuthenticated: false,
      token: null
    });
    localStorage.removeItem('f1-game-state');
    localStorage.removeItem('authToken');
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

  const incrementPacksOpened = () => {
    setGameState(prev => ({
      ...prev,
      packsOpened: prev.packsOpened + 1
    }));
  };

  const incrementCardsPurchased = () => {
    setGameState(prev => ({
      ...prev,
      cardsPurchased: prev.cardsPurchased + 1
    }));
  };

  useEffect(() => {
    const cardCount = gameState.userCards.length;
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === 'ten_cards') {
          const progress = Math.min((cardCount / 10) * 100, 100);
          return {
            ...a,
            progress,
            unlocked: a.unlocked || cardCount >= 10,
          };
        }
        if (a.id === 'hundred_cards') {
          const progress = Math.min((cardCount / 100) * 100, 100);
          return {
            ...a,
            progress,
            unlocked: a.unlocked || cardCount >= 100,
          };
        }
        return a;
      })
    );
  }, [gameState.userCards.length]);

  useEffect(() => {
    const coins = gameState.speedCoins;
    setAchievements(prev =>
      prev.map(a => {
        if (a.id !== 'million_coins') return a;
        const progress = Math.min((coins / 1000000) * 100, 100);
        return {
          ...a,
          progress,
          unlocked: a.unlocked || coins >= 1000000,
        };
      })
    );
  }, [gameState.speedCoins]);

  useEffect(() => {
    const opened = gameState.packsOpened;
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === 'first_pack') {
          const progress = Math.min((opened / 1) * 100, 100);
          return {
            ...a,
            progress,
            unlocked: a.unlocked || opened >= 1,
          };
        }
        if (a.id === 'ten_packs') {
          const progress = Math.min((opened / 10) * 100, 100);
          return {
            ...a,
            progress,
            unlocked: a.unlocked || opened >= 10,
          };
        }
        return a;
      })
    );
  }, [gameState.packsOpened]);

  useEffect(() => {
    const purchased = gameState.cardsPurchased;
    setAchievements(prev =>
      prev.map(a => {
        if (a.id !== 'shop_15_cards') return a;
        const progress = Math.min((purchased / 15) * 100, 100);
        return {
          ...a,
          progress,
          unlocked: a.unlocked || purchased >= 15,
        };
      })
    );
  }, [gameState.cardsPurchased]);

  const unlockAchievement = (id: string, type: 'daily' | 'normal' = 'normal') => {
    const setter = type === 'daily' ? setDailyAchievements : setAchievements;
    setter(prev => {
      const achievement = prev.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;
      return prev.map(a =>
        a.id === id ? { ...a, progress: 100, unlocked: true } : a
      );
    });
  };

  const claimAchievementReward = (id: string, type: 'daily' | 'normal' = 'normal') => {
    const setter = type === 'daily' ? setDailyAchievements : setAchievements;
    setter(prev =>
      prev.map(a => {
        if (a.id === id && a.unlocked && !a.rewardClaimed) {
          updateSpeedCoins(a.reward);
          return { ...a, rewardClaimed: true };
        }
        return a;
      })
    );
  };

  return (
    <GameStateContext.Provider value={{
      gameState,
      achievements,
      dailyAchievements,
      login,
      logout,
      updateSpeedCoins,
      addCards,
      removeCard,
      unlockAchievement,
      claimAchievementReward,
      resetDailyChallenges,
      incrementPacksOpened,
      incrementCardsPurchased,
      lastUnlockedAchievement,
      clearLastAchievement,
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContext;
