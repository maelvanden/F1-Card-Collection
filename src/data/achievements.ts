import { Achievement } from '../types';

export const defaultAchievements: Achievement[] = [
  {
    id: 'first_pack',
    description: 'Acheter un pack',
    criteria: 'Acheter un pack dans la boutique',
    reward: 100,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'ten_cards',
    description: 'Collectionner 10 cartes',
    criteria: 'Posséder 10 cartes dans votre collection',
    reward: 200,
    progress: 0,
    unlocked: false,
  },
];
