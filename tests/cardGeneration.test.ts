import { describe, it, expect } from 'vitest';
import { generateRandomCard, openPack } from '../src/utils/cardGeneration.ts';
import { Card, CardRarity, CardType, PackType } from '../src/types/index.ts';

const rarityPrices: Record<CardRarity, { min: number; max: number }> = {
  [CardRarity.COMMON]: { min: 500, max: 1500 },
  [CardRarity.RARE]: { min: 2000, max: 4500 },
  [CardRarity.EPIC]: { min: 5000, max: 9500 },
  [CardRarity.LEGENDARY]: { min: 10000, max: 18000 },
  [CardRarity.MYTHIC]: { min: 20000, max: 35000 }
};

const validateCard = (card: Card): void => {
  expect(Object.values(CardType)).toContain(card.type);
  expect(Object.values(CardRarity)).toContain(card.rarity);

  const { min, max } = rarityPrices[card.rarity];
  expect(card.price).toBeGreaterThanOrEqual(min);
  expect(card.price).toBeLessThanOrEqual(max);
};

describe('card generation', () => {
  it('generates card with valid properties', () => {
    const card = generateRandomCard(PackType.BASIC);
    validateCard(card);
  });

  it('opens pack with requested number of cards', () => {
    const cardCount = 5;
    const cards = openPack(PackType.PREMIUM, cardCount);
    expect(cards).toHaveLength(cardCount);
    cards.forEach(validateCard);
  });
});

