<template>
  <NavbarTop />
  <PrimeToast />
  <PrimeConfirmDialog />
  <ModalsContainer />
  <div class="outer-view">
    <RouterView />
  </div>
  <FooterComponent />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { RouterView } from 'vue-router';
import FooterComponent from './components/FooterComponent.vue';
import ModalsContainer from './components/Modals/ModalsContainer.vue';
import NavbarTop from './components/NavbarTop/NavbarTop.vue';
import ExtraBetService from './services/extra_bet';
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
const extraBetService = new ExtraBetService();
const clockStore = useClockStore();
const extraBetStore = useExtraBetStore();

// Set to true while startup is still resolving — prevents the activeProfile
// watcher from double-fetching when the cookie session auto-logs the user in.
const isInitializing = ref(true);

function initializationCallback(isSuccess: boolean) {
  if (isSuccess) {
    matchService.fetch();
  }
}

// ------ Initialization ------
startupService.initialize(initializationCallback).then(() => {
  clockStore.startClock();
  rankingService.fetch();
  isInitializing.value = false;
});

const { selectedWeek } = storeToRefs(useConfigurationStore());
const { activeProfile } = storeToRefs(useActiveProfileStore());

// ------ Watches ------
// Fetches week's matches and week's ranking when selectedWeek is changed
watch(selectedWeek, async (newValue, oldValue) => {
  if (newValue !== oldValue) {
    matchService.fetch();
  }
});

// Fetches rankings and week's matches when user logs in or out
// Fetches rankings and week's matches when user updates profile
// Skips the initial startup transition to avoid duplicate requests.
watch(activeProfile, async (newValue) => {
  if (isInitializing.value) return;

  rankingService.fetch();
  matchService.fetch();

  // Fetches extra bets if user logged in, clears bets if user logged out
  if (newValue) {
    extraBetService.fetch();
  } else {
    extraBetStore.setLoggedUserBets(null);
  }
});
</script>

<style scoped>
.outer-view {
  width: var(--page-width);
  flex: 1;
}
</style>
