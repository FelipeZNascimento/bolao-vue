import { useConfigurationStore } from '@/stores/configuration';
import { type Match, useMatchesStore } from '@/stores/matches';

import ApiService from './api_request';

interface fetchMatch {
  matches: Match[];
  season: string;
  week: string;
}

export default class MatchService {
  private apiRequest;
  private configurationStore;
  private matchesStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.matchesStore = useMatchesStore();
  }

  public async fetch(week?: null | number, season?: null | number) {
    this.matchesStore.setLoading(true);
    // Week may be "0" so needs to be checked against null and undefined
    if (week === undefined || week === null) {
      week = this.configurationStore.selectedWeek;
    }

    // Season may be "0" so needs to be checked against null and undefined
    if (season === undefined || season === null) {
      season = this.configurationStore.currentSeason;
    }

    try {
      const response = await this.apiRequest.get<fetchMatch>(`match/list/${season}/${week}`);
      this.matchesStore.setMatches(response.matches);
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(null);
    } catch (error: any) {
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(new Error(error));
    }
  }

  public async updateBet(
    matchId: number,
    betValue: number,
    callback?: (isSuccess: boolean, error?: Error) => void,
  ) {
    const betObject = {
      betValue,
      matchId,
    };

    try {
      await this.apiRequest.post<Match>(`bet/update/`, betObject);
      // const response = await this.apiRequest.post<Match>(`bet/update/`, betObject);
      // Deal with the response update the match in the store?

      if (callback) {
        callback(true);
      }
    } catch (error: unknown) {
      if (callback) {
        callback(false, error as Error);
      }
    }
  }
}
