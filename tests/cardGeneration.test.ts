import { describe, expect, it } from 'vitest';

import { generateRandomCard, openPack } from '../src/utils/cardGeneration';
import { CardRarity, CardType, PackType } from '../src/types';

describe('generateRandomCard', () => {
  it('génère une carte valide', () => {
    const card = generateRandomCard(PackType.BASIC);

    expect(typeof card.id).toBe('string');
    expect(typeof card.name).toBe('string');
    expect(Object.values(CardType)).toContain(card.type);
    expect(Object.values(CardRarity)).toContain(card.rarity);
    expect(typeof card.price).toBe('number');
  });
});

describe('openPack', () => {
  it('retourne le nombre correct de cartes', () => {
    const cards = openPack(PackType.BASIC, 5);
    expect(cards).toHaveLength(5);
  });
});

