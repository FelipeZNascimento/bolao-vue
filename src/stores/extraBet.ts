import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ExtraBet } from '@/services/extra_bet';
import type { ConferenceChampions, DivisionChampions, Wildcards } from '@/views/Extras/types';

import type { User } from './activeProfile';
import type { Team } from './matches';

export type BetByCategory = {
  conference: Omit<User, 'email, fullName, status, isOnline'>[];
  division: Omit<User, 'email, fullName, status, isOnline'>[];
  superbowl: Omit<User, 'email, fullName, status, isOnline'>[];
  wildcard: Omit<User, 'email, fullName, status, isOnline'>[];
};
export type Conference = 'AFC' | 'NFC';
export type ConferenceTeams = {
  east: ExtrasTeam[];
  north: ExtrasTeam[];
  south: ExtrasTeam[];
  west: ExtrasTeam[];
};

export type Division = 'East' | 'North' | 'South' | 'West';

export type ExtraBetsByCategory = {
  conference: ExtrasTeam[];
  division: ExtrasTeam[];
  superbowl: ExtrasTeam | null;
  wildcard: ExtrasTeam[];
};

export type ExtrasTeam = Omit<Team, 'possession, score'> & {
  conference: Conference;
  division: Division;
};
export type NormalizedExtraBets = {
  conferenceChampions: ConferenceChampions;
  divisionChampions: DivisionChampions;
  superbowl: ExtrasTeam | null;
  wildcards: Wildcards;
};

export type UserBetByTeam = {
  bets: BetByCategory;
  team: ExtrasTeam;
};

export const initialNormalizedExtraBets = {
  conferenceChampions: {
    AFC: null,
    NFC: null,
  },
  divisionChampions: {
    AFC: { East: null, North: null, South: null, West: null },
    NFC: { East: null, North: null, South: null, West: null },
  },
  superbowl: null,
  wildcards: {
    AFC: [],
    NFC: [],
  },
};

const initialExtraBetsByCategory = {
  conference: [],
  division: [],
  superbowl: null,
  wildcard: [],
};

export const useExtraBetStore = defineStore('extras', () => {
  const afcTeams = ref<ConferenceTeams>({ east: [], north: [], south: [], west: [] });
  const nfcTeams = ref<ConferenceTeams>({ east: [], north: [], south: [], west: [] });

  const allUsersBets = ref<ExtraBet[]>([]);
  const correctExtraBets = ref<ExtraBet[]>([]);
  const loggedUserBets = ref<ExtraBet[]>([]);
  const normalizedLoggedUserBets = ref<NormalizedExtraBets>({ ...initialNormalizedExtraBets });

  const correctBetsByCategory = ref<ExtraBetsByCategory>({ ...initialExtraBetsByCategory });
  const loggedUserBetsByCategory = ref<ExtraBetsByCategory>({ ...initialExtraBetsByCategory });
  const allUsersBetsByTeam = ref<UserBetByTeam[]>([]);

  const isUpdating = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  function setNormalizedLoggedUserBets(newValue: NormalizedExtraBets) {
    normalizedLoggedUserBets.value = newValue;
  }

  function setLoggedUserBetsByCategory(
    newWildcard: ExtrasTeam[],
    newDivision: ExtrasTeam[],
    newConference: ExtrasTeam[],
    newSuperbowl: ExtrasTeam | null,
  ) {
    loggedUserBetsByCategory.value.wildcard = newWildcard;
    loggedUserBetsByCategory.value.division = newDivision;
    loggedUserBetsByCategory.value.conference = newConference;
    loggedUserBetsByCategory.value.superbowl = newSuperbowl;
  }

  function setCorrectBetsByCategory(
    newWildcard: ExtrasTeam[],
    newDivision: ExtrasTeam[],
    newConference: ExtrasTeam[],
    newSuperbowl: ExtrasTeam | null,
  ) {
    correctBetsByCategory.value.wildcard = newWildcard;
    correctBetsByCategory.value.division = newDivision;
    correctBetsByCategory.value.conference = newConference;
    correctBetsByCategory.value.superbowl = newSuperbowl;
  }

  function setAllUsersBetsByTeam(newValue: UserBetByTeam[]) {
    allUsersBetsByTeam.value = newValue;
  }

  function setLoggedUserBets(newExtras: ExtraBet[]) {
    loggedUserBets.value = newExtras;
  }

  function setCorrectExtraBets(newExtras: ExtraBet[]) {
    correctExtraBets.value = newExtras;
  }

  function resetLoggedUserBets() {
    loggedUserBets.value = [];
  }

  function setAllUsersBets(newExtras: ExtraBet[]) {
    allUsersBets.value = newExtras;
  }

  function setAfcTeams(newTeams: ConferenceTeams) {
    afcTeams.value = newTeams;
  }

  function setNfcTeams(newTeams: ConferenceTeams) {
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
    correctBetsByCategory,
    correctExtraBets,
    error,
    isLoading,
    isUpdating,
    loggedUserBets,
    loggedUserBetsByCategory,
    nfcTeams,
    normalizedLoggedUserBets,
    resetLoggedUserBets,
    setAfcTeams,
    setAllUsersBets,
    setAllUsersBetsByTeam,
    setCorrectBetsByCategory,
    setCorrectExtraBets,
    setError,
    setLoading,
    setLoggedUserBets,
    setLoggedUserBetsByCategory,
    setNfcTeams,
    setNormalizedLoggedUserBets,
    setUpdating,
  };
});
