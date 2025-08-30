import { defineStore } from 'pinia';
import { ref } from 'vue';

export type RankingPosition = 'active' | 'modal';
export type ResultsView = 'grid' | 'lines';
export type Theme = 'dark' | 'light';

const initialState = {
  rankingPosition: 'active' as RankingPosition,
  resultsView: 'grid' as ResultsView,
  theme: 'dark' as Theme,
};

export const useConfigurationStore = defineStore('configuration', () => {
  const currentSeason = ref<null | number>(null);
  const seasonStart = ref<null | number>(null);
  const currentWeek = ref<null | number>(null);
  const selectedWeek = ref<null | number>(null);
  const isLoading = ref<boolean>(true);
  const error = ref<Error | null>(null);
  const theme = ref<Theme>(initialState.theme);
  const resultsView = ref<ResultsView>(initialState.resultsView);
  const rankingPosition = ref<RankingPosition>(initialState.rankingPosition);

  function setInitialState() {
    theme.value = initialState.theme;
    resultsView.value = initialState.resultsView;
    rankingPosition.value = initialState.rankingPosition;
    localStorage.removeItem('ranking-columns');
    localStorage.removeItem('theme-preference');
    localStorage.removeItem('ranking-position');
  }

  function setSeasonStart(timestamp: number) {
    seasonStart.value = timestamp;
  }

  function isDarkMode() {
    return theme.value === 'dark';
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme-preference', newTheme);
  }

  function setRankingPosition(newValue: RankingPosition) {
    rankingPosition.value = newValue;
    localStorage.setItem('ranking-position', newValue);
  }

  function setResultsView(view: ResultsView) {
    resultsView.value = view;
    localStorage.setItem('results-view', view);
  }

  function toggleTheme() {
    setTheme(isDarkMode() ? 'light' : 'dark');
  }

  function setCurrentSeason(season: number) {
    currentSeason.value = season;
  }

  function setCurrentWeek(week: number) {
    currentWeek.value = week;
  }

  function setSelectedWeek(week: number) {
    selectedWeek.value = week;
  }

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return {
    currentSeason,
    currentWeek,
    error,
    isDarkMode,
    isLoading,
    rankingPosition,
    resultsView,
    seasonStart,
    selectedWeek,
    setCurrentSeason,
    setCurrentWeek,
    setError,
    setInitialState,
    setLoading,
    setRankingPosition,
    setResultsView,
    setSeasonStart,
    setSelectedWeek,
    setTheme,
    theme,
    toggleTheme,
  };
});
