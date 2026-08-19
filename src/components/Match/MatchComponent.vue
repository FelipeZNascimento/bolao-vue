<template>
  <div
    class="outer-match"
    :class="{
      line: !isGridMode && !isMobileOnly,
      grid: isGridMode || isMobileOnly,
      'grid--full-width': !isGridMode && isMobileOnly,
      clickable: isMatchStarted,
      'outer-match--unbetted': !isMatchStarted && !match.loggedUserBets,
      'outer-match--bullseye': ribbon === 'BULLSEYE',
      'outer-match--half': ribbon === 'HALF',
      'outer-match--miss': ribbon === 'MISS'
    }"
    @click="handleMatchClick"
  >
    <ClockComponent
      v-if="!isDemo"
      :ribbon="ribbon"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="match.clock"
      :isGridMode="isGridMode"
      :isMatchStarted="isMatchStarted"
      :odds="{ overUnder: match.overUnder, odds: match.homeTeamOdds }"
    />
    <ScoreComponent
      :isBetting="isBetting"
      :isGridMode="isGridMode"
      :match="match"
      :activeUserBet="match.loggedUserBets ?? null"
      :isMatchStarted="isMatchStarted"
      :ribbon="ribbon"
    />
  </div>
  <BetsModal
    :match="match"
    :activeUserBet="match.loggedUserBets ?? null"
    :correctBets="correctBets"
    :isOpen="isBetsModalOpen"
    :ribbon="ribbon"
    :handleCloseModal="handleCloseModal"
  />
</template>
<script lang="ts" setup>
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';
import { computed, ref } from 'vue';
import { useClockStore } from '@/stores/clock';
import type { IMatch } from '@/stores/matches.types';
import { calculateCorrectBets, isBullseye, isHalfBet } from '@/util/betsCalculator';
import BetsModal from './BetsModal/BetsModal.vue';
import ClockComponent from './ClockComponent.vue';
import ScoreComponent from './ScoreComponent.vue';

const props = withDefaults(
  defineProps<{
    isBetting?: boolean;
    isDemo?: boolean;
    isGridMode?: boolean;
    match: IMatch;
  }>(),
  {
    isBetting: false,
    isDemo: false,
    isGridMode: false
  }
);

// ------ Refs ------
const isBetsModalOpen = ref(false);

// ------ Initialization ------
const clockStore = useClockStore();

// ------ Computed Properties ------
const correctBets = computed(() => calculateCorrectBets(props.match.away.score, props.match.home.score));
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

const ribbon = computed(() => {
  if (!props.match.loggedUserBets || !isMatchStarted.value) {
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
  if (props.isBetting || props.isDemo || !isMatchStarted.value) {
    return;
  }
  isBetsModalOpen.value = true;
}
</script>
<style lang="scss" scoped>
.outer-match {
  display: flex;
  opacity: 1;
  border: 1px solid var(--bolao-c-grey3);

  &--bullseye {
    border: 1px solid var(--bolao-c-gold);
    box-shadow: 0px 0px 2px 2px var(--bolao-c-gold);
  }
  &--half {
    border: 1px solid var(--bolao-c-blue);
    box-shadow: 0px 0px 2px 2px var(--bolao-c-blue);
  }
  &--miss {
    border: 1px solid var(--bolao-c-red);
    box-shadow: 0px 0px 2px 2px var(--bolao-c-red);
  }

  &--unbetted {
    box-shadow: 0px 0px 2px 2px var(--bolao-c-white);
  }
}

.clickable {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px -2px var(--color-contrast);

    :deep(.team-shield-image) {
      transform: scale(1.4);
    }
  }
}

.line {
  min-height: 50px;
  width: 100%;
  gap: var(--xs-spacing);
}

.grid {
  flex-direction: column;

  @media (max-width: 1023px) {
    height: 120px;
    width: 170px;
  }

  @media (min-width: 1024px) {
    height: 140px;
    width: 250px;
  }

  &--full-width {
    width: 100% !important;
  }
}
</style>
