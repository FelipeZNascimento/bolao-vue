<template>
  <PrimeDialog
    v-if="selectedBetsMatch"
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    :style="{ width: '1024px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
    contentClass="content-class"
  >
    <template #header>
      <ClockComponent
        :timestamp="match.timestamp"
        :status="match.status"
        :clock="match.clock"
        :ribbon="ribbon"
        :isMatchStarted="isMatchStarted"
        :odds="{ overUnder: match.overUnder, odds: match.homeTeamOdds }"
        fluid
      />
    </template>

    <div class="teams-outer">
      <ScoreComponent
        :match="match"
        :activeUserBet="match.loggedUserBets"
        :isMatchStarted="isMatchStarted"
        :ribbon="ribbon"
      />
    </div>
    <div
      class="bets-outer"
      v-if="isMatchStarted"
    >
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.AWAY_EASY"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.AWAY_HARD"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.HOME_HARD"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="match.bets"
        :columnValue="BETS_VALUES.HOME_EASY"
        :activeUserBet="match.loggedUserBets"
        :correctBets="correctBets"
      />
    </div>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { BETS_VALUES } from '@/constants/bets';
import { useClockStore } from '@/stores/clock';
import { useMatchesStore } from '@/stores/matches';
import { calculateCorrectBets, calculateRibbon } from '@/util/betsCalculator';
import ClockComponent from '../ClockComponent.vue';
import ScoreComponent from '../ScoreComponent.vue';
import BetsColumn from './BetsColumn.vue';

// ------ Initialization ------
const clockStore = useClockStore();
const matchesStore = useMatchesStore();
const { selectedBetsMatch } = storeToRefs(matchesStore);
const { closeBetsModal } = matchesStore;

const isVisible = computed({
  get: () => selectedBetsMatch.value !== null,
  set: (val) => {
    if (!val) closeBetsModal();
  }
});

const match = computed(() => selectedBetsMatch.value!);

const isMatchStarted = computed(
  () => !!selectedBetsMatch.value && clockStore.currentTimestamp >= selectedBetsMatch.value.timestamp
);

const correctBets = computed(() => calculateCorrectBets(match.value?.away.score ?? 0, match.value?.home.score ?? 0));

const ribbon = computed(() =>
  calculateRibbon(correctBets.value, match.value?.loggedUserBets?.value, isMatchStarted.value)
);
</script>
<style lang="scss" scoped>
.teams-outer {
  display: flex;
  width: 100%;
  /* height: 50px; */
}

.team-column {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.bets-outer {
  display: flex;
  overflow-x: hidden !important;
}

.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
}
</style>
