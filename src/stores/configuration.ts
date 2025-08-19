import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Theme = 'dark' | 'light';
export type ResultsView = 'lines' | 'grid';

export const useConfigurationStore = defineStore('configuration', () => {
  const currentSeason = ref<number | null>(null);
  const currentWeek = ref<number | null>(null);
  const selectedWeek = ref<number | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const theme = ref<Theme>('dark');
  const resultsView = ref<ResultsView>('grid');

  // Add a function to reset the store to its initial state

  function initialize() {
    const themePreference = localStorage.getItem('theme-preference');
    const resultsViewPreference = localStorage.getItem('results-view');
    if (resultsViewPreference) {
      resultsView.value = resultsViewPreference as ResultsView;
    } else {
      localStorage.setItem('results-view', 'grid');
    }

    if (themePreference) {
      document.documentElement.setAttribute('data-theme', themePreference);
      if (themePreference === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark-mode');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('Dark mode is enabled');
      setTheme('dark');
    } else {
      console.log('Light mode is enabled');
      setTheme('light');
    }
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
    initialize,
    setTheme,
    toggleTheme,
    setCurrentSeason,
    setCurrentWeek,
    setSelectedWeek,
    setResultsView,
    setLoading,
    setError,
    isDarkMode,
    theme,
    resultsView,
    currentSeason,
    currentWeek,
    selectedWeek,
    isLoading,
    error,
  };
});
