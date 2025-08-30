import type { User } from '@/stores/activeProfile';

import { useConfigurationStore } from '@/stores/configuration';
import { type ColumnsOption, type RowSpacing, useRankingStore } from '@/stores/ranking';

import ApiService from './api_request';

export type RankingUser = User & {
  isOnline: boolean;
  position: number;
  previousPosition: number;
  totalBets: number;
  totalBullseye: number;
  totalExtras: number;
  totalMatches: number;
  totalPercentage: string;
  totalPoints: number;
  totalWinners: number;
};

type SeasonRanking = {
  season: string;
  totalPossiblePoints: number;
  users: RankingUser[];
};

type WeeklyRanking = SeasonRanking & {
  week: string;
};

export default class RankingService {
  private apiRequest;
  private configurationStore;
  private rankingStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.rankingStore = useRankingStore();
    this.configurationStore = useConfigurationStore();
  }

  public async fetchSeason() {
    const season = this.configurationStore.currentSeason;
    this.rankingStore.setLoadingSeason(true);

    try {
      const response = await this.apiRequest.get<SeasonRanking>(`ranking/season/${season}`);
      this.rankingStore.setLoadingSeason(false);
      this.rankingStore.setSeason(response.users);
      this.rankingStore.setErrorSeason(null);
    } catch (error: any) {
      this.rankingStore.setLoadingSeason(false);
      this.rankingStore.setErrorSeason(new Error(error));
    }
  }

  public async fetchWeek(week: number) {
    const season = this.configurationStore.currentSeason;
    this.rankingStore.setLoadingWeek(true);

    try {
      const response = await this.apiRequest.get<WeeklyRanking>(`ranking/list/${season}/${week}`);
      this.rankingStore.setLoadingWeek(false);
      this.rankingStore.setCurrentWeek(response.users);
      this.rankingStore.setErrorWeek(null);
    } catch (error: any) {
      this.rankingStore.setLoadingWeek(false);
      this.rankingStore.setErrorWeek(new Error(error));
    }
  }

  public async initialize() {
    this.initializePreferences();
    const currentWeek = this.configurationStore.currentWeek;

    this.fetchSeason();

    if (currentWeek) {
      this.fetchWeek(currentWeek);
    }
  }

  async initializePreferences() {
    const rankingColumns = localStorage.getItem('ranking-columns');
    const rankingSpacing = localStorage.getItem('ranking-spacing');

    if (!rankingColumns) {
      localStorage.setItem('ranking-columns', 'complete');
    } else {
      this.rankingStore.columnsOption = rankingColumns as ColumnsOption;
    }

    if (!rankingSpacing) {
      localStorage.setItem('ranking-spacing', 'normal');
    } else {
      this.rankingStore.rowSpacing = rankingSpacing as RowSpacing;
    }
  }
}
