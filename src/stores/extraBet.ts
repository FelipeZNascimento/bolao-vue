import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IConferenceTeams, IExtraBet, ITeamWithExtras } from './extraBet.types';

export const useExtraBetStore = defineStore('extras', () => {
  const afcTeams = ref<IConferenceTeams>({ East: [], North: [], South: [], West: [] });
  const nfcTeams = ref<IConferenceTeams>({ East: [], North: [], South: [], West: [] });

  const allUsersBets = ref<IExtraBet[]>([]);
  const extraBetsResults = ref<IExtraBet | null>(null);
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

  function setExtraBetsResults(newExtras: IExtraBet | null) {
    extraBetsResults.value = newExtras;
  }

  function resetLoggedUserBets() {
    loggedUserBets.value = null;
  }

  function setAllUsersBets(newExtras: IExtraBet[]) {
    allUsersBets.value = newExtras;
  }

  function setAfcTeams(newTeams: IConferenceTeams) {
    afcTeams.value = newTeams;
  }

  function setNfcTeams(newTeams: IConferenceTeams) {
    nfcTeams.value = newTeams;
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
    afcTeams,
    allUsersBets,
    allUsersBetsByTeam,
    error,
    extraBetsResults,
    isLoading,
    isUpdating,
    loggedUserBets,
    nfcTeams,
    resetLoggedUserBets,
    setAfcTeams,
    setAllUsersBets,
    setAllUsersBetsByTeam,
    setError,
    setExtraBetsResults,
    setLoading,
    setLoggedUserBets,
    setNfcTeams,
    setUpdating,
  };
});
