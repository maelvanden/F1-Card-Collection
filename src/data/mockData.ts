import { Card, CardType, CardRarity, Pack, PackType, MarketListing, User } from '../types';

export const mockUser: User = {
  id: '1',
  username: 'SpeedRacer',
  email: 'speedracer@f1cards.com',
  speedCoins: 50000,
  registrationDate: new Date('2024-01-15')
};

export const sampleCards: Card[] = [
  {
    id: '1',
    name: 'Lewis Hamilton Black Card',
    type: CardType.PILOT,
    rarity: CardRarity.LEGENDARY,
    price: 15000,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'Champion du monde 7 fois, pilote de légende Mercedes',
    obtainedDate: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Max Verstappen Red Bull Card',
    type: CardType.PILOT,
    rarity: CardRarity.LEGENDARY,
    price: 14000,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'Champion en titre, vitesse pure',
    obtainedDate: new Date('2024-01-22')
  },
  {
    id: '3',
    name: 'Monaco Circuit',
    type: CardType.CIRCUIT,
    rarity: CardRarity.EPIC,
    price: 8000,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'Le circuit le plus prestigieux de F1'
  },
  {
    id: '4',
    name: 'Ferrari Team Card',
    type: CardType.TEAM,
    rarity: CardRarity.RARE,
    price: 5000,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'La Scuderia, légende italienne'
  },
  {
    id: '5',
    name: 'Adrian Newey',
    type: CardType.ENGINEER,
    rarity: CardRarity.EPIC,
    price: 7500,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'Génie de l\'aérodynamique'
  }
];

export const availablePacks: Pack[] = [
  {
    id: '1',
    name: 'Pack Débutant',
    type: PackType.BASIC,
    price: 2500,
    cardCount: 3,
    description: 'Pack parfait pour commencer votre collection',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'
  },
  {
    id: '2',
    name: 'Pack Premium',
    type: PackType.PREMIUM,
    price: 7500,
    cardCount: 5,
    description: 'Chances accrues d\'obtenir des cartes rares',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'
  },
  {
    id: '3',
    name: 'Pack Légendaire',
    type: PackType.LEGENDARY,
    price: 15000,
    cardCount: 7,
    description: 'Fortes chances d\'obtenir des cartes épiques',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'
  }
];

export const dailyShopCards: Card[] = [
  {
    id: '101',
    name: 'Charles Leclerc Ferrari',
    type: CardType.PILOT,
    rarity: CardRarity.RARE,
    price: 6000,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'Le prince de Monaco'
  },
  {
    id: '102',
    name: 'Silverstone Circuit',
    type: CardType.CIRCUIT,
    rarity: CardRarity.RARE,
    price: 5500,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'Temple de la vitesse britannique'
  },
  {
    id: '103',
    name: 'Mercedes AMG Team',
    type: CardType.TEAM,
    rarity: CardRarity.EPIC,
    price: 9000,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: 'Étoile d\'argent allemande'
  }
];

export const marketListings: MarketListing[] = [
  {
    id: '1',
    cardId: '201',
    sellerId: '2',
    sellerUsername: 'F1Master',
    price: 12000,
    listedDate: new Date('2024-01-25'),
    card: {
      id: '201',
      name: 'Lando Norris McLaren',
      type: CardType.PILOT,
      rarity: CardRarity.EPIC,
      price: 12000,
      imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
      description: 'Jeune talent britannique'
    }
  },
  {
    id: '2',
    cardId: '202',
    sellerId: '3',
    sellerUsername: 'RaceCollector',
    price: 8500,
    listedDate: new Date('2024-01-24'),
    card: {
      id: '202',
      name: 'Spa-Francorchamps',
      type: CardType.CIRCUIT,
      rarity: CardRarity.EPIC,
      price: 8500,
      imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
      description: 'Circuit mythique belge'
    }
  }
];