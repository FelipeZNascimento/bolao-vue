import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from './activeProfile';
import type { MatchStatus } from '@/constants/match_status';

export interface Team {
  id: number;
  name: string;
  alias: string;
  code: string;
  background: string;
  foreground: string;
  winLosses: string;
  possession: boolean;
  score: number;
}

export interface Bet {
  id: number;
  matchId: number;
  value: number;
  user: Omit<User, 'status, fullname, email'>;
}

export interface Match {
  id: number;
  timestamp: number;
  status: MatchStatus;
  clock: string;
  overUnder: string;
  homeTeamOdds: string;
  away: Team;
  home: Team;
  bets: Bet[];
  loggedUserBets: Bet | null;
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

  return { resetLoggedUserBets, setLoading, setMatches, setError, isLoading, matches, error };
});
