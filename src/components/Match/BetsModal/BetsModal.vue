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
      <ScoreComponent :match="match" :activeUserBet="match.loggedUserBets" />
    </div>
    <div class="bets-outer">
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
    <!-- <template #footer>a</template> -->
  </PrimeDialog>
</template>
<script setup lang="ts">
import type { Match } from '@/stores/matches';
import { ref, watch } from 'vue';
import ScoreComponent from '../ScoreComponent.vue';
import { BETS_VALUES } from '@/constants/bets';
import { type CorrectBets } from '@/util/betsCalculator';
import BetsColumn from './BetsColumn.vue';

const props = defineProps<{
  isOpen: boolean;
  correctBets: CorrectBets;
  match: Match;
  handleCloseModal: () => void;
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
