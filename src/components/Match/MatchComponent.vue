<template>
  <div
    class="outer-match"
    :class="{
      line: !isGridMode && !isMobileOnly,
      grid: isGridMode || isMobileOnly,
      'grid--full-width': !isGridMode && isMobileOnly,
      'outer-match--clickable': isMatchStarted,
      'outer-match--unbetted': activeProfile && !isMatchStarted && !match.loggedUserBets,
      'outer-match--bullseye': ribbon === 'BULLSEYE',
      'outer-match--half': ribbon === 'HALF',
      'outer-match--miss': ribbon === 'MISS'
    }"
    @click="isMatchStarted ? handleMatchClick() : undefined"
  >
    <ClockComponent
      v-if="!isDemo"
      :isClickable="!isMatchStarted"
      :ribbon="ribbon"
      :timestamp="match.timestamp"
      :status="match.status"
      :clock="match.clock"
      :isGridMode="isGridMode"
      :isMatchStarted="isMatchStarted"
      :odds="{ overUnder: match.overUnder, odds: match.homeTeamOdds }"
      @click="!isMatchStarted ? handleMatchClick() : undefined"
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
</template>
<script lang="ts" setup>
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile.ts';
import { useClockStore } from '@/stores/clock';
import { useMatchesStore } from '@/stores/matches';
import type { IMatch } from '@/stores/matches.types';
import { calculateCorrectBets, calculateRibbon } from '@/util/betsCalculator';
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

// ------ Initialization ------
const clockStore = useClockStore();
const { activeProfile } = storeToRefs(useActiveProfileStore());
const { openBetsModal } = useMatchesStore();

// ------ Computed Properties ------
const correctBets = computed(() => calculateCorrectBets(props.match.away.score, props.match.home.score));

const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

const ribbon = computed(() =>
  calculateRibbon(correctBets.value, props.match.loggedUserBets?.value, isMatchStarted.value)
);

// ------ Functions ------
function handleMatchClick() {
  if (props.isBetting || props.isDemo) {
    return;
  }
  openBetsModal(props.match);
}
</script>
<style lang="scss" scoped>
.outer-match {
  display: flex;
  opacity: 1;
  border: 1px solid var(--bolao-c-grey3);

  &--bullseye {
    border: 1px solid var(--bolao-c-gold);
    box-shadow: 0px 0px 1px 1px var(--bolao-c-gold);
  }
  &--half {
    border: 1px solid var(--bolao-c-blue);
    box-shadow: 0px 0px 1px 1px var(--bolao-c-blue);
  }
  &--miss {
    border: 1px solid var(--bolao-c-red);
    box-shadow: 0px 0px 1px 1px var(--bolao-c-red);
  }

  &--unbetted {
    box-shadow: 0px 0px 2px 2px var(--bolao-c-white);
  }

  &--clickable {
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: scale(1.02);

      :deep(.team-shield-image) {
        transform: scale(1.2);
      }
    }
  }
}

.line {
  min-height: var(--team-component-height);
  width: 100%;
}

.grid {
  flex-direction: column;

  @media (max-width: 1023px) {
    width: 170px;
  }

  @media (min-width: 1024px) {
    // max-height: 140px;
    width: 250px;
  }

  &--full-width {
    width: 100% !important;
  }
}
</style>
