import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { MatchStatus } from '@/constants/match_status';

import type { User } from './activeProfile';
import type { Conference, Division } from './extraBet';

export interface Bet {
  id: number;
  matchId: number;
  user: Omit<User, 'status, fullname, email'>;
  value: number;
}

export interface Match {
  away: Team;
  bets: Bet[];
  clock: string;
  home: Team;
  homeTeamOdds: string;
  id: number;
  loggedUserBets: Bet | null;
  overUnder: string;
  status: MatchStatus;
  timestamp: number;
}

export interface Team {
  alias: string;
  background: string;
  code: string;
  conference: Conference;
  division: Division;
  foreground: string;
  id: number;
  name: string;
  possession: boolean;
  score: number;
  winLosses: string;
}

export const useMatchesStore = defineStore('matches', () => {
  const isLoading = ref<boolean>(false);
  const matches = ref<Match[]>([]);
  const error = ref<Error | null>(null);

  function resetLoggedUserBets() {
    matches.value.forEach((match) => {
      match.loggedUserBets = null;
    });
  }

  function setMatches(newMatches: Match[]) {
    matches.value = newMatches;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return { error, isLoading, matches, resetLoggedUserBets, setError, setLoading, setMatches };
});
