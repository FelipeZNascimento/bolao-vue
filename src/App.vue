<template>
  <NavbarTop />
  <PrimeToast />
  <div class="outer-view">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavbarTop from './components/NavbarTop/NavbarTop.vue';
import StartupService from './services/startup';
import MatchService from './services/match';
import { useClockStore } from './stores/clock';
import RankingService from './services/ranking';
import { computed, watch } from 'vue';
import { useConfigurationStore } from './stores/configuration';
import { useActiveProfileStore } from './stores/activeProfile';

const startupService = new StartupService();
const matchService = new MatchService();
const rankingService = new RankingService();
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();

function initializationCallback(isSuccess: boolean) {
  if (isSuccess) {
    matchService.fetch();
  }
}

// ------ Initialization ------
startupService.initialize(initializationCallback).then(() => {
  rankingService.initialize();
  clockStore.startClock();
  rankingService.initialize();
});

// ------ Computed ------
const selectedWeek = computed(() => configurationStore.selectedWeek);
const activeProfile = computed(() => activeProfileStore.activeProfile);

// Fetches week's matches and week's ranking when selectedWeek is changed
watch(selectedWeek, async (newValue, oldValue) => {
  if (newValue && oldValue && newValue !== oldValue) {
    rankingService.fetchWeek(newValue);
    matchService.fetch();
  }
});

// Fetches rankings and week's matches when user logs in or out
// Fetches rankings and week's matches when user updates profile
watch(activeProfile, async () => {
  if (!selectedWeek.value) {
    return;
  }

  rankingService.fetchSeason();
  rankingService.fetchWeek(selectedWeek.value);
  matchService.fetch();
});
</script>

<style scoped>
.outer-view {
  width: 100%;
}
</style>
