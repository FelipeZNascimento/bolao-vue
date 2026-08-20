import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IConferenceTeams } from './extraBet.types';
import type { ITeam } from './matches.types';

const emptyConferenceObj: IConferenceTeams = { East: [], North: [], South: [], West: [] };

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<ITeam[]>([]);
  const afcTeams = ref<IConferenceTeams>({ ...emptyConferenceObj });
  const nfcTeams = ref<IConferenceTeams>({ ...emptyConferenceObj });
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  function setTeams(newTeams: ITeam[]) {
    teams.value = newTeams;
  }

  function setAfcTeams(newTeams: IConferenceTeams) {
    afcTeams.value = newTeams;
  }

  function setNfcTeams(newTeams: IConferenceTeams) {
    nfcTeams.value = newTeams;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return {
    afcTeams,
    nfcTeams,
    error,
    isLoading,
    teams,
    setAfcTeams,
    setNfcTeams,
    setLoading,
    setError,
    setTeams
  };
});
