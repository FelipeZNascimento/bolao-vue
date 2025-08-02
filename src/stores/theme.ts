import { ref } from 'vue';
import { defineStore } from 'pinia';

type TTheme = 'dark' | 'light';

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(false);

  function initialize() {
    const themePreference = localStorage.getItem('theme-preference');
    if (themePreference) {
      document.documentElement.setAttribute('data-theme', themePreference);
      if (themePreference === 'dark') {
        darkMode.value = true;
        document.documentElement.classList.add('my-app-dark');
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

  function setTheme(newTheme: TTheme) {
    darkMode.value = newTheme === 'dark' ? true : false;
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('my-app-dark');
    localStorage.setItem('theme-preference', newTheme);
    console.log('Settando... ', newTheme);
  }

  function toggleTheme() {
    setTheme(darkMode.value ? 'light' : 'dark');
  }

  return { darkMode, initialize, getTheme, setTheme, toggleTheme };
});
