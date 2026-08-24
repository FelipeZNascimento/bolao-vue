import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import type { IMatch } from '@/stores/matches.types';
import { useRankingStore } from '@/stores/ranking';
import type { IRankingLine, IWeeklyRanking } from '@/stores/ranking.types';
import ApiService from './api_request';
import WebsocketService from './websocket';

interface fetchMatch {
  matches: IMatch[];
  season: string;
  week: string;
}

export default class MatchService {
  private websocketInstance;
  private apiRequest;
  private configurationStore;
  private matchesStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.configurationStore = useConfigurationStore();
    this.matchesStore = useMatchesStore();
    this.websocketInstance = new WebsocketService(this.onWebsocketUpdate, () => this.fetch());
  }

  public async fetch(week?: null | number, season?: null | number) {
    this.matchesStore.setLoading(true);
    this.matchesStore.setError(null);
    // Week may be "0" so needs to be checked against null and undefined
    if (week === undefined || week === null) {
      week = this.configurationStore.selectedWeek;
    }

    // Season may be "0" so needs to be checked against null and undefined
    if (season === undefined || season === null) {
      season = this.configurationStore.currentSeason;
    }

    try {
      const currentWeek = this.configurationStore.currentWeek;
      const isViewingCurrentWeek = week === currentWeek;

      const requests: Promise<fetchMatch>[] = [this.apiRequest.get<fetchMatch>(`match/${season}/${week}`)];

      // If the user is browsing a past/future week, also refresh the live week
      // so the home dashboard stays up to date after returning from another tab
      if (!isViewingCurrentWeek && currentWeek) {
        requests.push(this.apiRequest.get<fetchMatch>(`match/${season}/${currentWeek}`));
      }

      const [selectedResponse, currentResponse] = await Promise.all(requests);

      this.matchesStore.setMatches(selectedResponse.matches);
      this.matchesStore.setCurrentWeekMatches(
        isViewingCurrentWeek ? selectedResponse.matches : (currentResponse?.matches ?? selectedResponse.matches)
      );

      this.matchesStore.setLoading(false);
      this.matchesStore.setError(null);

      this.websocketInstance.connect();
    } catch (error: unknown) {
      this.matchesStore.setLoading(false);
      this.matchesStore.setError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private onWebsocketUpdate(this: WebSocket, ev: MessageEvent<unknown>) {
    const configurationStore = useConfigurationStore();
    const selectedWeek = configurationStore.selectedWeek;

    const { matches, ranking, week } = JSON.parse(String(ev.data)) as {
      matches: IMatch[];
      ranking: { seasonRanking: IRankingLine[]; weeklyRanking: IWeeklyRanking[] };
      week: number;
    };

    const matchesStore = useMatchesStore();
    const currentWeek = configurationStore.currentWeek;

    // Update the selected-week view if the websocket update is for the week being viewed
    if (selectedWeek === week) {
      matchesStore.updateMatches(matches);
    }

    // Always keep the current-week snapshot up to date for the home dashboard
    if (currentWeek === week) {
      matchesStore.updateCurrentWeekMatches(matches);
    }

    const rankingStore = useRankingStore();
    rankingStore.setSeason(ranking.seasonRanking);
    rankingStore.setWeeks(ranking.weeklyRanking);
  }
}
