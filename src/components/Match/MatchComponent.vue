<template>
  <div class="outer-match" @click="handleMatchClick">
    <ClockComponent
      :ribbon="ribbon"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="match.clock"
    />
    <ScoreComponent :away="match.away" :home="match.home" />
  </div>
  <BetsModal
    :away="match.away"
    :home="match.home"
    :bets="match.bets"
    :activeUserBet="match.loggedUserBets"
    :correctBets="correctBets"
    :isOpen="isBetsModalOpen"
    :handleCloseModal="handleCloseModal"
  />
</template>
<script lang="ts" setup>
import type { Match } from '@/stores/matches';
import ClockComponent from './ClockComponent.vue';
import ScoreComponent from './ScoreComponent.vue';
import { computed, ref } from 'vue';
import BetsModal from './BetsModal/BetsModal.vue';
import { calculateCorrectBets, isBullseye, isHalfBet } from '@/util/betsCalculator';
const props = defineProps<{
  match: Match;
}>();

const isBetsModalOpen = ref(false);

// ------ Computed Properties ------
const correctBets = computed(() =>
  calculateCorrectBets(props.match.away.score, props.match.home.score),
);

const ribbon = computed(() => {
  if (!props.match.loggedUserBets) {
    return null;
  }

  if (isBullseye(correctBets.value, props.match.loggedUserBets.value)) {
    return 'BULLSEYE';
  } else if (isHalfBet(correctBets.value, props.match.loggedUserBets.value)) {
    return 'HALF';
  }

  return 'MISS';
});

// ------ Functions ------
function handleMatchClick() {
  isBetsModalOpen.value = true;
}

function handleCloseModal() {
  isBetsModalOpen.value = false;
}
</script>
<style scoped>
.outer-match {
  display: flex;
  height: 60px;
  width: 100%;
  margin: var(--s-spacing) 0;
  opacity: 0.8;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}
</style>
