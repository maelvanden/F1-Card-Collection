import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useGameStateContext } from '../../hooks/useGameState';
import { Button } from '../ui/Button';
import { Achievement } from '../../types';

const AchievementsPanel: React.FC = () => {
  const { achievements, dailyAchievements, claimAchievementReward } = useGameStateContext();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const parisNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
      const midnight = new Date(parisNow);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - parisNow.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderAchievement = (ach: Achievement, type: 'daily' | 'normal') => (
    <li
      key={ach.id}
      className="p-4 rounded-lg bg-black/40 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-white font-semibold">{ach.description}</p>
          <p className="text-gray-400 text-sm">{ach.criteria}</p>
        </div>
        {ach.unlocked ? (
          <Trophy className="w-6 h-6 text-yellow-400" />
        ) : (
          <span className="text-gray-400 text-sm">{ach.progress}%</span>
        )}
      </div>
      <p className="text-green-400 text-sm">Récompense : {ach.reward} SC</p>
      {ach.unlocked && !ach.rewardClaimed && (
        <Button onClick={() => claimAchievementReward(ach.id, type)} size="sm" className="mt-2">
          Récupérer la récompense
        </Button>
      )}
      {ach.unlocked && ach.rewardClaimed && (
        <p className="text-green-400 text-sm mt-2">Récompense récupérée</p>
      )}
    </li>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 py-8 px-4">
      <div className="max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
          Succès
        </h2>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Succès journaliers</h3>
          <p className="text-gray-400 text-sm mb-4">Réinitialisation dans {timeLeft}</p>
          <ul className="space-y-4">
            {dailyAchievements.map((ach) => renderAchievement(ach, 'daily'))}
            {dailyAchievements.length === 0 && (
              <li className="text-gray-400">Aucun succès disponible.</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Succès</h3>
          <ul className="space-y-4">
            {achievements.map((ach) => renderAchievement(ach, 'normal'))}
            {achievements.length === 0 && (
              <li className="text-gray-400">Aucun succès disponible.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPanel;
