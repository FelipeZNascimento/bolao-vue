import type { User } from '@/stores/activeProfile';
import type { Team } from '@/stores/matches';

import { EXTRA_BETS_VALUES, type ExtraBetsValues } from '@/constants/bets';
import { useConfigurationStore } from '@/stores/configuration';
import {
  type ExtrasTeam,
  initialNormalizedExtraBets,
  type NormalizedExtraBets,
  useExtraBetStore,
  type UserBetByTeam,
} from '@/stores/extraBet';

import ApiService from './api_request';

export type ExtraBet = {
  teams: Omit<Team, 'possessionm, score'>[];
  type: ExtraBetsValues;
};
export type ExtraBetUserObj = {
  bets: ExtraBet[];
  user: Omit<User, 'email, fullName, status, isOnline'>;
};

interface extrasFetch {
  bets: ExtraBetUserObj[];
  results: ExtraBet[];
  season: string;
  userBets: ExtraBet[];
}

export default class ExtraBetService {
  private apiRequest;
  private configurationStore;
  private extraBetStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.extraBetStore = useExtraBetStore();
    this.configurationStore = useConfigurationStore();
  }

  public async fetch() {
    const season = this.configurationStore.currentSeason;
    this.extraBetStore.setLoading(true);

    try {
      const response = await this.apiRequest.get<extrasFetch>(`extrabet/list/${season}`);
      this.extraBetStore.setLoggedUserBets(response.userBets);

      // Processing logged user extra bets
      this.processExtraBets(response.userBets, 'loggedUser');
      // Processing extra bets results
      if (response.results) {
        this.processExtraBets(response.results, 'results');
      }
      // Processing all users extra bets results
      this.processAllUsersExtraBets(response.bets);

      this.extraBetStore.setLoading(false);
    } catch (error: any) {
      this.extraBetStore.setLoading(false);
      this.extraBetStore.setError(new Error(error));
    }
  }

  processAllUsersExtraBets(allUsersExtraBets: ExtraBetUserObj[]) {
    const allUsersBetsByTeam: UserBetByTeam[] = [];

    const allTeams = [
      ...this.extraBetStore.afcTeams.north,
      ...this.extraBetStore.afcTeams.east,
      ...this.extraBetStore.afcTeams.south,
      ...this.extraBetStore.afcTeams.west,
      ...this.extraBetStore.nfcTeams.north,
      ...this.extraBetStore.nfcTeams.east,
      ...this.extraBetStore.nfcTeams.south,
      ...this.extraBetStore.nfcTeams.west,
    ].sort((a, b) => a.name.localeCompare(b.name));

    allTeams.map((team) => {
      const wildcardBetters: Omit<User, 'email, fullName, status, isOnline'>[] = [];
      const divisionBetters: Omit<User, 'email, fullName, status, isOnline'>[] = [];
      const conferenceBetters: Omit<User, 'email, fullName, status, isOnline'>[] = [];
      const superbowlBetters: Omit<User, 'email, fullName, status, isOnline'>[] = [];

      allUsersExtraBets.forEach((userExtraBets) => {
        const processedBets = this.processExtraBets(userExtraBets.bets, 'allUsers');
        if (processedBets.wildcardBets.find((bet) => bet.id === team.id)) {
          wildcardBetters.push(userExtraBets.user);
        }

        if (processedBets.championBets.find((bet) => bet.id === team.id)) {
          divisionBetters.push(userExtraBets.user);
        }

        if (processedBets.conferenceBets.find((bet) => bet.id === team.id)) {
          conferenceBetters.push(userExtraBets.user);
        }

        if (processedBets.superbowlBet && processedBets.superbowlBet.id === team.id) {
          superbowlBetters.push(userExtraBets.user);
        }
      });

      const teamObj = {
        bets: {
          conference: conferenceBetters,
          division: divisionBetters,
          superbowl: superbowlBetters,
          wildcard: wildcardBetters,
        },
        team: team,
      };

      allUsersBetsByTeam.push(teamObj);
    });

    this.extraBetStore.setAllUsersBetsByTeam(allUsersBetsByTeam);
  }

  processExtraBets(
    newExtras: ExtraBet[],
    mode: 'allUsers' | 'loggedUser' | 'results',
  ): {
    championBets: ExtrasTeam[];
    conferenceBets: ExtrasTeam[];
    superbowlBet: ExtrasTeam | null;
    wildcardBets: ExtrasTeam[];
  } {
    const normalizedExtraBets: NormalizedExtraBets = { ...initialNormalizedExtraBets };
    const championBets: ExtrasTeam[] = [];
    const conferenceBets: ExtrasTeam[] = [];
    let wildcardBets: ExtrasTeam[] = [];
    let superbowlBet: ExtrasTeam | null = null;

    newExtras.forEach((userBet) => {
      if (userBet.type === EXTRA_BETS_VALUES.SUPERBOWL) {
        normalizedExtraBets.superbowl = userBet.teams[0];
        superbowlBet = userBet.teams[0];
      } else if (userBet.type === EXTRA_BETS_VALUES.AFC) {
        normalizedExtraBets.conferenceChampions.AFC = userBet.teams[0];
        conferenceBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.AFC_NORTH) {
        normalizedExtraBets.divisionChampions.AFC.North = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.AFC_EAST) {
        normalizedExtraBets.divisionChampions.AFC.East = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.AFC_SOUTH) {
        normalizedExtraBets.divisionChampions.AFC.South = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.AFC_WEST) {
        normalizedExtraBets.divisionChampions.AFC.West = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.NFC) {
        normalizedExtraBets.conferenceChampions.NFC = userBet.teams[0];
        conferenceBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.NFC_NORTH) {
        normalizedExtraBets.divisionChampions.NFC.North = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.NFC_EAST) {
        normalizedExtraBets.divisionChampions.NFC.East = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.NFC_SOUTH) {
        normalizedExtraBets.divisionChampions.NFC.South = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.NFC_WEST) {
        normalizedExtraBets.divisionChampions.NFC.West = userBet.teams[0];
        championBets.push(userBet.teams[0]);
      } else if (userBet.type === EXTRA_BETS_VALUES.AFC_WILDCARD) {
        normalizedExtraBets.wildcards.AFC = userBet.teams;
        wildcardBets = [...wildcardBets, ...userBet.teams];
      } else if (userBet.type === EXTRA_BETS_VALUES.NFC_WILDCARD) {
        normalizedExtraBets.wildcards.NFC = userBet.teams;
        wildcardBets = [...wildcardBets, ...userBet.teams];
      }
    });

    if (mode === 'loggedUser') {
      this.extraBetStore.setLoggedUserBets(newExtras);
      this.extraBetStore.setNormalizedLoggedUserBets(normalizedExtraBets);
      this.extraBetStore.setLoggedUserBetsByCategory(
        wildcardBets,
        championBets,
        conferenceBets,
        superbowlBet,
      );
    } else if (mode === 'results') {
      this.extraBetStore.setCorrectExtraBets(newExtras);
      this.extraBetStore.setCorrectBetsByCategory(
        wildcardBets,
        championBets,
        conferenceBets,
        superbowlBet,
      );
    }

    return {
      championBets,
      conferenceBets,
      superbowlBet,
      wildcardBets,
    };
  }

  public async update(
    updateObj: { [n: string]: null | number | number[] },
    callback?: (isSuccess: boolean, error?: Error) => void,
  ) {
    this.extraBetStore.setUpdating(true);

    try {
      await this.apiRequest.post<extrasFetch>(`extrabet/update/`, updateObj);
      // const response = await this.apiRequest.post<extrasFetch>(`extrabet/update/`, updateObj);
      // this.extraBetStore.setLoggedUserBets(response.userBets);
      this.extraBetStore.setUpdating(false);
      if (callback) {
        callback(true);
      }
    } catch (error: unknown) {
      this.extraBetStore.setUpdating(false);
      if (callback) {
        callback(false, error as Error);
      }
    }
  }
}
