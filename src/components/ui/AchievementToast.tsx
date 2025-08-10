import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStateContext } from '../../hooks/useGameState';
import { Button } from './Button';

const AchievementToast: React.FC = () => {
  const { lastUnlockedAchievement, clearLastAchievement } = useGameStateContext();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (lastUnlockedAchievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        clearLastAchievement();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [lastUnlockedAchievement, clearLastAchievement]);

  if (!visible || !lastUnlockedAchievement) return null;

  const close = () => {
    setVisible(false);
    clearLastAchievement();
  };

  return createPortal(
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg w-72 relative">
      <button onClick={close} className="absolute top-2 right-2 text-gray-300 hover:text-white">
        <X size={16} />
      </button>
      <p className="font-bold mb-1">Objectif atteint ✅</p>
      <p className="mb-3">{lastUnlockedAchievement.description}</p>
      <Button size="sm" onClick={() => { navigate('/achievements'); close(); }}>
        Voir les succès
      </Button>
    </div>,
    document.body
  );
};

export default AchievementToast;
