import type { RankingUser } from '@/services/ranking';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ColumnsOption = 'COMPACT' | 'COMPLETE';
export type RowSpacing = 'normal' | 'small';

export const useRankingStore = defineStore('ranking', () => {
  const isLoadingWeek = ref(false);
  const isLoadingSeason = ref(false);
  const errorWeek = ref<Error | null>(null);
  const errorSeason = ref<Error | null>(null);
  const seasonRanking = ref<RankingUser[]>([]);
  const currentWeekRanking = ref<RankingUser[]>([]);
  const columnsOption = ref<ColumnsOption>('COMPLETE');
  const rowSpacing = ref<RowSpacing>('normal');

  function setSeason(newSeasonRanking: RankingUser[]) {
    seasonRanking.value = newSeasonRanking;
  }

  function setCurrentWeek(newCurrentWeekRanking: RankingUser[]) {
    currentWeekRanking.value = newCurrentWeekRanking;
  }

  function setLoadingWeek(loadingState: boolean) {
    isLoadingWeek.value = loadingState;
  }

  function setLoadingSeason(loadingState: boolean) {
    isLoadingSeason.value = loadingState;
  }

  function setErrorWeek(newError: Error | null) {
    errorWeek.value = newError;
  }

  function setErrorSeason(newError: Error | null) {
    errorSeason.value = newError;
  }

  function setColumnsOption(newValue: ColumnsOption) {
    columnsOption.value = newValue;
    localStorage.setItem('ranking-columns', newValue);
  }

  function setRowSpacing(newValue: RowSpacing) {
    rowSpacing.value = newValue;
    localStorage.setItem('ranking-spacing', newValue);
  }

  return {
    isLoadingWeek,
    isLoadingSeason,
    errorWeek,
    errorSeason,
    seasonRanking,
    currentWeekRanking,
    columnsOption,
    rowSpacing,
    setSeason,
    setCurrentWeek,
    setLoadingWeek,
    setLoadingSeason,
    setErrorWeek,
    setErrorSeason,
    setColumnsOption,
    setRowSpacing,
  };
});
