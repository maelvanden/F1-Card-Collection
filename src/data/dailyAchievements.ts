import { Achievement } from '../types';

export const defaultDailyAchievements: Achievement[] = [
  {
    id: 'daily_pack',
    description: "Acheter un pack aujourd'hui",
    criteria: 'Acheter un pack dans la boutique aujourd\'hui',
    reward: 50,
    progress: 0,
    unlocked: false,
    rewardClaimed: false,
  },
  {
    id: 'daily_shop_card',
    description: "Acheter une carte dans le shop aujourd'hui",
    criteria: 'Acheter une carte dans la boutique journalière',
    reward: 50,
    progress: 0,
    unlocked: false,
    rewardClaimed: false,
  },
];
