<template>
  <div
    class="outer-match"
    :class="{ line: !isGridMode, grid: isGridMode, clickable: !isBetting }"
    @click="handleMatchClick"
  >
    <ClockComponent
      v-if="isDesktop"
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
    :ribbon="ribbon"
    :handleCloseModal="handleCloseModal"
  />
</template>
<script lang="ts" setup>
import { isDesktop } from '@basitcodeenv/vue3-device-detect';
import { computed, ref } from 'vue';

import type { Match } from '@/stores/matches';

import { calculateCorrectBets, isBullseye, isHalfBet } from '@/util/betsCalculator';

import BetsModal from './BetsModal/BetsModal.vue';
import ClockComponent from './ClockComponent.vue';
import ScoreComponent from './ScoreComponent.vue';

const props = withDefaults(
  defineProps<{
    isBetting?: boolean;
    isGridMode?: boolean;
    match: Match;
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

function handleCloseModal() {
  isBetsModalOpen.value = false;
}

// ------ Functions ------
function handleMatchClick() {
  if (props.isBetting) {
    return;
  }
  isBetsModalOpen.value = true;
}
</script>
<style scoped>
.outer-match {
  display: flex;
  opacity: 1;
}

.clickable {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.line {
  min-height: 60px;
  width: 100%;
}

.grid {
  flex-direction: column;

  @media (max-width: 1023px) {
    height: 120px;
    width: 170px;
  }

  @media (min-width: 1024px) {
    height: 150px;
    width: 250px;
  }
}
</style>
