import { BETS_VALUES, type BetsValues } from '@/constants/bets';

export type CorrectBets = { bullseye: BetsValues[]; half: BetsValues[] };

export function calculateCorrectBets(awayScore: number, homeScore: number) {
  if (awayScore === homeScore) {
    return {
      bullseye: [],
      half: [BETS_VALUES.HOME_HARD, BETS_VALUES.AWAY_HARD]
    };
  }

  if (awayScore > homeScore) {
    if (awayScore - 7 > homeScore) {
      return {
        bullseye: [BETS_VALUES.AWAY_EASY],
        half: [BETS_VALUES.AWAY_HARD]
      };
    } else {
      return {
        bullseye: [BETS_VALUES.AWAY_HARD],
        half: [BETS_VALUES.AWAY_EASY]
      };
    }
  }

  if (awayScore < homeScore) {
    if (awayScore + 7 < homeScore) {
      return {
        bullseye: [BETS_VALUES.HOME_EASY],
        half: [BETS_VALUES.HOME_HARD]
      };
    } else {
      return {
        bullseye: [BETS_VALUES.HOME_HARD],
        half: [BETS_VALUES.HOME_EASY]
      };
    }
  }

  return {
    bullseye: [],
    half: [BETS_VALUES.HOME_HARD, BETS_VALUES.AWAY_HARD]
  };
}

export function isBullseye(correctBets: CorrectBets, betValue: BetsValues | undefined) {
  return correctBets.bullseye.find((bullseyeBet) => bullseyeBet === betValue) !== undefined;
}

export function isHalfBet(correctBets: CorrectBets, betValue: BetsValues | undefined) {
  return correctBets.half.find((halfBet) => halfBet === betValue) !== undefined;
}

export function calculateCorrectMargin(awayScore: number, homeScore: number) {
  if (awayScore > homeScore) {
    if (awayScore - homeScore > 7) {
      return BETS_VALUES.AWAY_EASY;
    } else {
      return BETS_VALUES.AWAY_HARD;
    }
  } else if (awayScore < homeScore) {
    if (homeScore - awayScore > 7) {
      return BETS_VALUES.HOME_EASY;
    } else {
      return BETS_VALUES.HOME_HARD;
    }
  }

  return null;
}
