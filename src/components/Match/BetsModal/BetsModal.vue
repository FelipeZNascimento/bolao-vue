<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    :style="{ width: '1024px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Apostas</h2>
    </template>
    <div class="teams-outer">
      <ScoreComponent :away="away" :home="home" />
    </div>
    <div class="bets-outer">
      <BetsColumn
        :bets="bets"
        :columnValue="BETS_VALUES.AWAY_EASY"
        :activeUserBet="activeUserBet"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="bets"
        :columnValue="BETS_VALUES.AWAY_HARD"
        :activeUserBet="activeUserBet"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="bets"
        :columnValue="BETS_VALUES.HOME_HARD"
        :activeUserBet="activeUserBet"
        :correctBets="correctBets"
      />
      <BetsColumn
        :bets="bets"
        :columnValue="BETS_VALUES.HOME_EASY"
        :activeUserBet="activeUserBet"
        :correctBets="correctBets"
      />
    </div>
    <!-- <template #footer>a</template> -->
  </PrimeDialog>
</template>
<script setup lang="ts">
import type { Bet, Team } from '@/stores/matches';
import { ref, watch } from 'vue';
import ScoreComponent from '../ScoreComponent.vue';
import { BETS_VALUES } from '@/constants/bets';
import { type CorrectBets } from '@/util/betsCalculator';
import BetsColumn from './BetsColumn.vue';

const props = defineProps<{
  isOpen: boolean;
  handleCloseModal: () => void;
  bets: Bet[];
  activeUserBet: Bet | null;
  correctBets: CorrectBets;
  home: Team;
  away: Team;
}>();

const isVisible = ref(false);

watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style scoped>
.teams-outer {
  display: flex;
  width: 100%;
  height: 60px;
}

.team-column {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.bets-outer {
  display: flex;
}
</style>
