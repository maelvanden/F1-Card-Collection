import { Card, CardRarity, CardType, PackType } from '../types';

const cardPool = {
  [CardType.PILOT]: [
    'Lewis Hamilton', 'Max Verstappen', 'Charles Leclerc', 'George Russell',
    'Carlos Sainz', 'Lando Norris', 'Oscar Piastri', 'Fernando Alonso',
    'Lance Stroll', 'Esteban Ocon', 'Pierre Gasly', 'Valtteri Bottas'
  ],
  [CardType.CIRCUIT]: [
    'Monaco', 'Silverstone', 'Monza', 'Spa-Francorchamps',
    'Circuit de Suzuka', 'Interlagos', 'Circuit Gilles-Villeneuve',
    'Hungaroring', 'Red Bull Ring', 'Circuit de Barcelona'
  ],
  [CardType.TEAM]: [
    'Mercedes AMG', 'Red Bull Racing', 'Scuderia Ferrari', 'McLaren',
    'Aston Martin', 'Alpine', 'AlphaTauri', 'Alfa Romeo',
    'Haas F1', 'Williams Racing'
  ],
  [CardType.ENGINEER]: [
    'Adrian Newey', 'James Allison', 'Rob Marshall', 'Pat Fry',
    'Pierre Waché', 'Andrew Shovlin', 'Simone Resta'
  ],
  [CardType.TEAM_PRINCIPAL]: [
    'Christian Horner', 'Toto Wolff', 'Frédéric Vasseur', 'Andrea Stella',
    'Mike Krack', 'Franz Tost', 'James Vowles'
  ]
};

const rarityWeights = {
  [PackType.BASIC]: {
    [CardRarity.COMMON]: 60,
    [CardRarity.RARE]: 30,
    [CardRarity.EPIC]: 8,
    [CardRarity.LEGENDARY]: 2,
    [CardRarity.MYTHIC]: 0
  },
  [PackType.PREMIUM]: {
    [CardRarity.COMMON]: 40,
    [CardRarity.RARE]: 35,
    [CardRarity.EPIC]: 18,
    [CardRarity.LEGENDARY]: 6,
    [CardRarity.MYTHIC]: 1
  },
  [PackType.LEGENDARY]: {
    [CardRarity.COMMON]: 20,
    [CardRarity.RARE]: 30,
    [CardRarity.EPIC]: 30,
    [CardRarity.LEGENDARY]: 17,
    [CardRarity.MYTHIC]: 3
  }
};

const rarityPrices = {
  [CardRarity.COMMON]: { min: 500, max: 1500 },
  [CardRarity.RARE]: { min: 2000, max: 4500 },
  [CardRarity.EPIC]: { min: 5000, max: 9500 },
  [CardRarity.LEGENDARY]: { min: 10000, max: 18000 },
  [CardRarity.MYTHIC]: { min: 20000, max: 35000 }
};

export const generateRandomCard = (packType: PackType): Card => {
  const rarity = selectRarityByWeight(packType);
  const cardType = getRandomCardType();
  const cardName = getRandomCardName(cardType);
  const price = generatePrice(rarity);

  return {
    id: `generated_${Date.now()}_${Math.random()}`,
    name: cardName,
    type: cardType,
    rarity,
    price,
    imageUrl: 'https://images.pexels.com/photos/8775636/pexels-photo-8775636.jpeg',
    description: generateDescription(cardName, cardType, rarity),
    obtainedDate: new Date()
  };
};

const selectRarityByWeight = (packType: PackType): CardRarity => {
  const weights = rarityWeights[packType];
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let currentWeight = 0;
  for (const [rarity, weight] of Object.entries(weights)) {
    currentWeight += weight;
    if (random <= currentWeight) {
      return rarity as CardRarity;
    }
  }
  
  return CardRarity.COMMON;
};

const getRandomCardType = (): CardType => {
  const types = Object.values(CardType);
  return types[Math.floor(Math.random() * types.length)];
};

const getRandomCardName = (cardType: CardType): string => {
  const names = cardPool[cardType];
  const baseName = names[Math.floor(Math.random() * names.length)];
  
  // Add variant suffix based on type
  const variants = {
    [CardType.PILOT]: ['Racing Card', 'Championship Card', 'Victory Card', 'Legend Card'],
    [CardType.CIRCUIT]: ['Circuit', 'Track Card', 'Grand Prix Card'],
    [CardType.TEAM]: ['Team Card', 'Racing Team', 'F1 Team'],
    [CardType.ENGINEER]: ['Master Engineer', 'Technical Card', 'Innovation Card'],
    [CardType.TEAM_PRINCIPAL]: ['Leadership Card', 'Strategy Card', 'Boss Card']
  };
  
  const variant = variants[cardType][Math.floor(Math.random() * variants[cardType].length)];
  return `${baseName} ${variant}`;
};

const generatePrice = (rarity: CardRarity): number => {
  const range = rarityPrices[rarity];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

const generateDescription = (name: string, type: CardType, rarity: CardRarity): string => {
  const descriptions = {
    [CardType.PILOT]: 'Pilote de Formule 1 d\'exception',
    [CardType.CIRCUIT]: 'Circuit mythique de la Formule 1',
    [CardType.TEAM]: 'Écurie de Formule 1 de renom',
    [CardType.ENGINEER]: 'Ingénieur technique de haut niveau',
    [CardType.TEAM_PRINCIPAL]: 'Dirigeant d\'équipe stratégique'
  };
  
  const rarityAdjectives = {
    [CardRarity.COMMON]: 'Prometteur',
    [CardRarity.RARE]: 'Talentueux',
    [CardRarity.EPIC]: 'Exceptionnel',
    [CardRarity.LEGENDARY]: 'Légendaire',
    [CardRarity.MYTHIC]: 'Mythique'
  };
  
  return `${rarityAdjectives[rarity]} ${descriptions[type].toLowerCase()}`;
};

export const openPack = (packType: PackType, cardCount: number): Card[] => {
  const cards: Card[] = [];
  for (let i = 0; i < cardCount; i++) {
    cards.push(generateRandomCard(packType));
  }
  return cards;
};