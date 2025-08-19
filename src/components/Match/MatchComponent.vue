<template>
  <div
    class="outer-match"
    :class="{ line: !isGridMode, grid: isGridMode }"
    @click="handleMatchClick"
  >
    <ClockComponent
      :ribbon="ribbon"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="match.clock"
    />
    <ScoreComponent
      :isBetting="isBetting"
      :isGridMode="isGridMode"
      :match="match"
      :activeUserBet="match.loggedUserBets"
    />
  </div>
  <BetsModal
    :match="match"
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

const props = withDefaults(
  defineProps<{
    match: Match;
    isGridMode?: boolean;
    isBetting?: boolean;
  }>(),
  {
    isBetting: false,
    isGridMode: false,
  },
);

// ------ Refs ------
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
  if (props.isBetting) {
    return;
  }
  isBetsModalOpen.value = true;
}

function handleCloseModal() {
  isBetsModalOpen.value = false;
}
</script>
<style scoped>
.outer-match {
  display: flex;
  opacity: 1;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.line {
  height: 60px;
  width: 100%;
}

.grid {
  flex-direction: column;
  height: 150px;
  width: 250px;
}
</style>
