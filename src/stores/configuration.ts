import { defineStore } from 'pinia';
import { ref } from 'vue';

type Theme = 'dark' | 'light';

export const useConfigurationStore = defineStore('configuration', () => {
  const currentSeason = ref<number | null>(null);
  const currentWeek = ref<number | null>(null);
  const selectedWeek = ref<number | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const darkMode = ref(false);

  function initialize() {
    const themePreference = localStorage.getItem('theme-preference');
    if (themePreference) {
      document.documentElement.setAttribute('data-theme', themePreference);
      if (themePreference === 'dark') {
        darkMode.value = true;
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

  function getTheme() {
    return darkMode.value ? 'dark' : 'light';
  }

  function setTheme(newTheme: Theme) {
    darkMode.value = newTheme === 'dark' ? true : false;
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme-preference', newTheme);
  }

  function toggleTheme() {
    setTheme(darkMode.value ? 'light' : 'dark');
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
    getTheme,
    setTheme,
    toggleTheme,
    setCurrentSeason,
    setCurrentWeek,
    setSelectedWeek,
    setLoading,
    setError,
    darkMode,
    currentSeason,
    currentWeek,
    selectedWeek,
    isLoading,
    error,
  };
});
