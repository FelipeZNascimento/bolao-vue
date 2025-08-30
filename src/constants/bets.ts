export const BETS_VALUES = {
  AWAY_EASY: 0,
  AWAY_HARD: 1,
  HOME_EASY: 3,
  HOME_HARD: 2,
};

export const BETS_LABELS = {
  [BETS_VALUES.AWAY_EASY]: 'Fácil',
  [BETS_VALUES.AWAY_HARD]: 'Difícil',
  [BETS_VALUES.HOME_EASY]: 'Fácil',
  [BETS_VALUES.HOME_HARD]: 'Difícil',
};

export const EXTRA_BETS_VALUES = {
  AFC: 2,
  AFC_EAST: 5,
  AFC_NORTH: 3,
  AFC_SOUTH: 4,
  AFC_WEST: 6,
  AFC_WILDCARD: 12,
  NFC: 7,
  NFC_EAST: 10,
  NFC_NORTH: 8,
  NFC_SOUTH: 9,
  NFC_WEST: 11,
  NFC_WILDCARD: 13,
  SUPERBOWL: 1,
};

export type BetsValues = (typeof BETS_VALUES)[keyof typeof BETS_VALUES];
export type ExtraBetsValues = (typeof EXTRA_BETS_VALUES)[keyof typeof EXTRA_BETS_VALUES];
export type Ribbon = 'BULLSEYE' | 'HALF' | 'MISS' | null;
