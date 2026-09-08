import { describe, expect, it } from 'vitest';
import { BETS_VALUES } from '../constants/bets';
import {
  calculateCorrectBets,
  calculateCorrectMargin,
  calculateRibbon,
  isBullseye,
  isHalfBet
} from '../util/betsCalculator';

const { AWAY_EASY, AWAY_HARD, HOME_EASY, HOME_HARD } = BETS_VALUES;

// ─── calculateCorrectBets ─────────────────────────────────────────────────────
// The 7-point margin is the boundary: margin > 7 → EASY, margin ≤ 7 → HARD.

describe('calculateCorrectBets', () => {
  it('tie: no bullseye, both hard bets are half points', () => {
    const result = calculateCorrectBets(14, 14);
    expect(result.bullseye).toEqual([]);
    expect(result.half).toEqual([HOME_HARD, AWAY_HARD]);
  });

  it('away wins by more than 7: AWAY_EASY is bullseye, AWAY_HARD is half', () => {
    const result = calculateCorrectBets(21, 10); // margin = 11
    expect(result.bullseye).toEqual([AWAY_EASY]);
    expect(result.half).toEqual([AWAY_HARD]);
  });

  it('away wins by exactly 7: AWAY_HARD is bullseye, AWAY_EASY is half', () => {
    const result = calculateCorrectBets(17, 10); // margin = 7, boundary
    expect(result.bullseye).toEqual([AWAY_HARD]);
    expect(result.half).toEqual([AWAY_EASY]);
  });

  it('away wins by less than 7: AWAY_HARD is bullseye, AWAY_EASY is half', () => {
    const result = calculateCorrectBets(16, 10); // margin = 6
    expect(result.bullseye).toEqual([AWAY_HARD]);
    expect(result.half).toEqual([AWAY_EASY]);
  });

  it('home wins by more than 7: HOME_EASY is bullseye, HOME_HARD is half', () => {
    const result = calculateCorrectBets(10, 21); // margin = 11
    expect(result.bullseye).toEqual([HOME_EASY]);
    expect(result.half).toEqual([HOME_HARD]);
  });

  it('home wins by exactly 7: HOME_HARD is bullseye, HOME_EASY is half', () => {
    const result = calculateCorrectBets(10, 17); // margin = 7, boundary
    expect(result.bullseye).toEqual([HOME_HARD]);
    expect(result.half).toEqual([HOME_EASY]);
  });

  it('home wins by less than 7: HOME_HARD is bullseye, HOME_EASY is half', () => {
    const result = calculateCorrectBets(10, 16); // margin = 6
    expect(result.bullseye).toEqual([HOME_HARD]);
    expect(result.half).toEqual([HOME_EASY]);
  });
});

// ─── isBullseye ───────────────────────────────────────────────────────────────

describe('isBullseye', () => {
  const bets = { bullseye: [AWAY_EASY], half: [AWAY_HARD] };

  it('returns true when bet is in bullseye list', () => {
    expect(isBullseye(bets, AWAY_EASY)).toBe(true);
  });

  it('returns false when bet is in half list but not bullseye', () => {
    expect(isBullseye(bets, AWAY_HARD)).toBe(false);
  });

  it('returns false when betValue is undefined', () => {
    expect(isBullseye(bets, undefined)).toBe(false);
  });
});

// ─── isHalfBet ────────────────────────────────────────────────────────────────

describe('isHalfBet', () => {
  const bets = { bullseye: [AWAY_EASY], half: [AWAY_HARD] };

  it('returns true when bet is in half list', () => {
    expect(isHalfBet(bets, AWAY_HARD)).toBe(true);
  });

  it('returns false when bet is in bullseye list but not half', () => {
    expect(isHalfBet(bets, AWAY_EASY)).toBe(false);
  });

  it('returns false when betValue is undefined', () => {
    expect(isHalfBet(bets, undefined)).toBe(false);
  });
});

// ─── calculateRibbon ──────────────────────────────────────────────────────────

describe('calculateRibbon', () => {
  const bets = { bullseye: [AWAY_EASY], half: [AWAY_HARD] };

  it('returns null when betValue is undefined, regardless of match state', () => {
    expect(calculateRibbon(bets, undefined, true)).toBeNull();
  });

  it('returns null when match has not started, regardless of bet', () => {
    expect(calculateRibbon(bets, AWAY_EASY, false)).toBeNull();
  });

  it('returns BULLSEYE for a correct bet on the winning side by the right margin', () => {
    expect(calculateRibbon(bets, AWAY_EASY, true)).toBe('BULLSEYE');
  });

  it('returns HALF for a partially-correct bet', () => {
    expect(calculateRibbon(bets, AWAY_HARD, true)).toBe('HALF');
  });

  it('returns MISS for a completely wrong bet', () => {
    expect(calculateRibbon(bets, HOME_EASY, true)).toBe('MISS');
  });
});

// ─── calculateCorrectMargin ───────────────────────────────────────────────────

describe('calculateCorrectMargin', () => {
  it('returns AWAY_EASY when away wins by more than 7', () => {
    expect(calculateCorrectMargin(21, 10)).toBe(AWAY_EASY); // margin = 11
  });

  it('returns AWAY_HARD when away wins by exactly 7 (boundary)', () => {
    expect(calculateCorrectMargin(17, 10)).toBe(AWAY_HARD); // margin = 7
  });

  it('returns AWAY_HARD when away wins by less than 7', () => {
    expect(calculateCorrectMargin(13, 10)).toBe(AWAY_HARD); // margin = 3
  });

  it('returns HOME_EASY when home wins by more than 7', () => {
    expect(calculateCorrectMargin(10, 21)).toBe(HOME_EASY); // margin = 11
  });

  it('returns HOME_HARD when home wins by exactly 7 (boundary)', () => {
    expect(calculateCorrectMargin(10, 17)).toBe(HOME_HARD); // margin = 7
  });

  it('returns HOME_HARD when home wins by less than 7', () => {
    expect(calculateCorrectMargin(10, 13)).toBe(HOME_HARD); // margin = 3
  });

  it('returns null on a tie', () => {
    expect(calculateCorrectMargin(10, 10)).toBeNull();
  });
});
