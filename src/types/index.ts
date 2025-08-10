export interface User {
  id: string;
  username: string;
  email: string;
  speedCoins: number;
  registrationDate: Date;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  price: number;
  imageUrl: string;
  description: string;
  obtainedDate?: Date;
  userId?: string;
}

export interface Pack {
  id: string;
  name: string;
  type: PackType;
  price: number;
  cardCount: number;
  description: string;
  imageUrl: string;
}

export interface MarketListing {
  id: string;
  cardId: string;
  sellerId: string;
  sellerUsername: string;
  price: number;
  listedDate: Date;
  card: Card;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
}

export enum CardType {
  PILOT = 'pilot',
  CIRCUIT = 'circuit',
  TEAM = 'team',
  ENGINEER = 'engineer',
  TEAM_PRINCIPAL = 'team_principal',
  SPECIAL = 'special'
}

export enum CardRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
}

export enum PackType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  LEGENDARY = 'legendary'
}

export enum TransactionType {
  PACK_PURCHASE = 'pack_purchase',
  CARD_SALE = 'card_sale',
  CARD_PURCHASE = 'card_purchase',
  DAILY_REWARD = 'daily_reward'
}

export interface GameState {
  user: User | null;
  userCards: Card[];
  speedCoins: number;
  packsOpened: number;
  cardsPurchased: number;
  isAuthenticated: boolean;
  token: string | null;
}

export * from './achievement';
