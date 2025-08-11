import { describe, it, expect } from 'vitest';
import { getAllowedOrigins } from '../server/allowedOrigins.js';

describe('getAllowedOrigins', () => {
  it('handles a single domain', () => {
    expect(getAllowedOrigins('https://f1cardcollection.mvcraft.fr')).toEqual([
      'https://f1cardcollection.mvcraft.fr',
    ]);
  });

  it('handles multiple domains separated by commas', () => {
    expect(
      getAllowedOrigins(
        'https://example.com,https://admin.example.com'
      )
    ).toEqual(['https://example.com', 'https://admin.example.com']);
  });

  it('trims spaces and ignores empty values', () => {
    expect(
      getAllowedOrigins(' https://a.com , https://b.com , ')
    ).toEqual(['https://a.com', 'https://b.com']);
  });

  it('falls back to localhost when undefined', () => {
    expect(getAllowedOrigins(undefined)).toEqual(['http://localhost:5173']);
  });
});
