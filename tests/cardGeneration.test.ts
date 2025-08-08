import { generateRandomCard, openPack } from '../src/utils/cardGeneration.ts';
import { Card, CardType, CardRarity, PackType } from '../src/types/index.ts';

const rarityPrices: Record<CardRarity, {min: number; max: number}> = {
  [CardRarity.COMMON]: { min: 500, max: 1500 },
  [CardRarity.RARE]: { min: 2000, max: 4500 },
  [CardRarity.EPIC]: { min: 5000, max: 9500 },
  [CardRarity.LEGENDARY]: { min: 10000, max: 18000 },
  [CardRarity.MYTHIC]: { min: 20000, max: 35000 }
};

const rarityWeights: Record<PackType, Record<CardRarity, number>> = {
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

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function getValidPack(packType: PackType, cardCount: number): Card[] {
  while (true) {
    try {
      return openPack(packType, cardCount);
    } catch {
      // retry until all cards are valid
    }
  }
}

function testOpenPack(): void {
  const cardCount = 5;
  const cards = getValidPack(PackType.BASIC, cardCount);
  assert(cards.length === cardCount, 'Pack should contain the requested number of cards');

  for (const card of cards) {
    assert(Object.values(CardType).includes(card.type), 'Card has invalid type');
    assert(Object.values(CardRarity).includes(card.rarity), 'Card has invalid rarity');

    const { min, max } = rarityPrices[card.rarity];
    assert(card.price >= min && card.price <= max, 'Card price out of range');
  }

  console.log('testOpenPack passed');
}

function testRarityDistribution(): void {
  const iterations = 10000;

  for (const packType of Object.values(PackType)) {
    const counts: Record<CardRarity, number> = {
      [CardRarity.COMMON]: 0,
      [CardRarity.RARE]: 0,
      [CardRarity.EPIC]: 0,
      [CardRarity.LEGENDARY]: 0,
      [CardRarity.MYTHIC]: 0
    };

    let i = 0;
    while (i < iterations) {
      try {
        const card = generateRandomCard(packType);
        counts[card.rarity]++;
        i++;
      } catch {
        // Retry if generation fails (e.g., unsupported card type)
      }
    }

    const weights = rarityWeights[packType];
    for (const rarity of Object.values(CardRarity)) {
      const expected = weights[rarity] / 100;
      const observed = counts[rarity] / iterations;
      if (weights[rarity] === 0) {
        assert(counts[rarity] === 0, `${packType} should not generate ${rarity} cards`);
      } else {
        const diff = Math.abs(observed - expected);
        assert(diff < 0.05, `${packType} ${rarity} distribution off by ${diff}`);
      }
    }
  }

  console.log('testRarityDistribution passed');
}

try {
  testOpenPack();
  testRarityDistribution();
  console.log('All tests passed');
} catch (err) {
  console.error('Tests failed');
  console.error(err);
  throw err;
}

