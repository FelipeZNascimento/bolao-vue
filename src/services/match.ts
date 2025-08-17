import ApiService from './api_request';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore, type Match } from '@/stores/matches';

interface fetchMatch {
  season: string;
  week: string;
  matches: Match[];
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

  public async fetch(week?: number | null, season?: number | null) {
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
}
