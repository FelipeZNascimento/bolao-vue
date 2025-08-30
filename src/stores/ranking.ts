import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { RankingUser } from '@/services/ranking';

export type ColumnsOption = 'compact' | 'complete';
export type RowSpacing = 'normal' | 'small';

const initialState = {
  columnsOption: 'complete' as ColumnsOption,
  rowSpacing: 'small' as RowSpacing,
};

export const useRankingStore = defineStore('ranking', () => {
  const isLoadingWeek = ref(false);
  const isLoadingSeason = ref(false);
  const errorWeek = ref<Error | null>(null);
  const errorSeason = ref<Error | null>(null);
  const seasonRanking = ref<RankingUser[]>([]);
  const currentWeekRanking = ref<RankingUser[]>([]);
  const columnsOption = ref<ColumnsOption>(initialState.columnsOption);
  const rowSpacing = ref<RowSpacing>(initialState.rowSpacing);

  function setInitialState() {
    columnsOption.value = initialState.columnsOption;
    rowSpacing.value = initialState.rowSpacing;
    localStorage.removeItem('ranking-columns');
    localStorage.removeItem('ranking-spacing');
    localStorage.removeItem('ranking-position');
  }

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
    columnsOption,
    currentWeekRanking,
    errorSeason,
    errorWeek,
    isLoadingSeason,
    isLoadingWeek,
    rowSpacing,
    seasonRanking,
    setColumnsOption,
    setCurrentWeek,
    setErrorSeason,
    setErrorWeek,
    setInitialState,
    setLoadingSeason,
    setLoadingWeek,
    setRowSpacing,
    setSeason,
  };
});
