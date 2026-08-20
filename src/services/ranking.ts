import type { TColumnsValue, TRowSpacingValue } from '@/stores/configuration.types';
import { useRankingStore } from '@/stores/ranking';
import type { IRankingResponse } from '@/stores/ranking.types';
import ApiService from './api_request';

export default class RankingService {
  private apiRequest;
  private rankingStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.rankingStore = useRankingStore();
  }

  public async fetch() {
    this.rankingStore.setLoadingSeason(true);
    this.rankingStore.setErrorSeason(null);

    try {
      const rankingResponse = await this.apiRequest.get<IRankingResponse>(`ranking/season/`);
      this.rankingStore.setLoadingSeason(false);
      this.rankingStore.setSeason(rankingResponse.seasonRanking);
      this.rankingStore.setWeeks(rankingResponse.weeklyRanking);
    } catch (error: unknown) {
      this.rankingStore.setLoadingSeason(false);
      this.rankingStore.setErrorSeason(error instanceof Error ? error : new Error(String(error)));
    }
  }

  public async initialize() {
    this.initializePreferences();
    this.fetch();
  }

  async initializePreferences() {
    const rankingColumns = localStorage.getItem('ranking-columns');
    const rankingSpacing = localStorage.getItem('ranking-spacing');

    if (!rankingColumns) {
      localStorage.setItem('ranking-columns', 'complete');
    } else {
      this.rankingStore.columnsOption = rankingColumns as TColumnsValue;
    }

    if (!rankingSpacing) {
      localStorage.setItem('ranking-spacing', 'normal');
    } else {
      this.rankingStore.rowSpacing = rankingSpacing as TRowSpacingValue;
    }
  }
}
