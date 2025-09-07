import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IMatch } from './matches.types';

export const useMatchesStore = defineStore('matches', () => {
  const isLoading = ref<boolean>(false);
  const matches = ref<IMatch[]>([]);
  const error = ref<Error | null>(null);

  function resetLoggedUserBets() {
    matches.value.forEach((match) => {
      match.loggedUserBets = null;
    });
  }

  function setMatches(newMatches: IMatch[]) {
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
