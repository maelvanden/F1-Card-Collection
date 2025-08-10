import React from 'react';
import { Trophy } from 'lucide-react';
import { useGameStateContext } from '../../hooks/useGameState';
import { Button } from '../ui/Button';

const AchievementsPanel: React.FC = () => {
  const { achievements, claimAchievementReward } = useGameStateContext();

  return (
    <div className="p-6 bg-black/20 rounded-lg border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
        Succès
      </h2>
      <ul className="space-y-4">
        {achievements.map((ach) => (
            <li key={ach.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
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
                <Button onClick={() => claimAchievementReward(ach.id)} size="sm" className="mt-2">
                  Récupérer la récompense
                </Button>
              )}
              {ach.unlocked && ach.rewardClaimed && (
                <p className="text-green-400 text-sm mt-2">Récompense récupérée</p>
              )}
            </li>
          ))}
        {achievements.length === 0 && (
          <li className="text-gray-400">Aucun succès disponible.</li>
        )}
      </ul>
    </div>
  );
};

export default AchievementsPanel;
