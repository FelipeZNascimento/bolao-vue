<template>
  <NavbarTop />
  <PrimeToast />
  <div class="outer-view">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView } from 'vue-router';

import NavbarTop from './components/NavbarTop/NavbarTop.vue';
import MatchService from './services/match';
import RankingService from './services/ranking';
import StartupService from './services/startup';
import { useActiveProfileStore } from './stores/activeProfile';
import { useClockStore } from './stores/clock';
import { useConfigurationStore } from './stores/configuration';
import { useExtraBetStore } from './stores/extraBet';

const startupService = new StartupService();
const matchService = new MatchService();
const rankingService = new RankingService();
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
const extraBetStore = useExtraBetStore();

function initializationCallback(isSuccess: boolean) {
  if (isSuccess) {
    matchService.fetch();
  }
}

// ------ Initialization ------
startupService.initialize(initializationCallback).then(() => {
  clockStore.startClock();
});

// ------ Computed ------
const selectedWeek = computed(() => configurationStore.selectedWeek);
const activeProfile = computed(() => activeProfileStore.activeProfile);

// ------ Watches ------
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
  rankingService.fetchSeason();
  matchService.fetch();

  if (!activeProfile.value) {
    extraBetStore.setLoggedUserBets([]);
  }

  if (!selectedWeek.value) {
    return;
  }
  rankingService.fetchWeek(selectedWeek.value);
});
</script>

<style scoped>
.outer-view {
  width: 100%;
}
</style>
