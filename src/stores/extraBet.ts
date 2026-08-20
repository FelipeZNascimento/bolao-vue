import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IExtraBet, IExtraBetBet, ITeamWithExtras } from './extraBet.types';

export const useExtraBetStore = defineStore('extras', () => {
  const allUsersBets = ref<IExtraBet[]>([]);
  const extraBetsResults = ref<IExtraBetBet[] | null>(null);
  const loggedUserBets = ref<IExtraBet | null>(null);

  const allUsersBetsByTeam = ref<ITeamWithExtras[]>([]);

  const isUpdating = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  function setAllUsersBetsByTeam(newValue: ITeamWithExtras[]) {
    allUsersBetsByTeam.value = newValue;
  }

  function setLoggedUserBets(newExtras: IExtraBet | null) {
    loggedUserBets.value = newExtras;
  }

  function setExtraBetsResults(newExtras: IExtraBetBet[] | null) {
    extraBetsResults.value = newExtras;
  }

  function resetLoggedUserBets() {
    loggedUserBets.value = null;
  }

  function setAllUsersBets(newExtras: IExtraBet[]) {
    allUsersBets.value = newExtras;
  }

  function setUpdating(loadingState: boolean) {
    isUpdating.value = loadingState;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return {
    allUsersBets,
    allUsersBetsByTeam,
    error,
    extraBetsResults,
    isLoading,
    isUpdating,
    loggedUserBets,
    resetLoggedUserBets,
    setAllUsersBets,
    setAllUsersBetsByTeam,
    setError,
    setExtraBetsResults,
    setLoading,
    setLoggedUserBets,
    setUpdating
  };
});
