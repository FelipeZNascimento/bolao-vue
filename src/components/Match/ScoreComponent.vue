<template>
  <div
    :class="{
      'outer-score-wrapper-mobile': isMobileOnly,
      'outer-score-wrapper': !isMobileOnly
    }"
  >
    <div
      :class="{
        'outer-mobile-teams-line': isMobileOnly && !isGridStarted,
        'outer-mobile-teams-grid': isMobileOnly && isGridStarted,
        'outer-score-line': !isMobileOnly && !isGridStarted,
        'outer-score-grid': !isMobileOnly && isGridStarted
      }"
      style="position: relative"
    >
      <!-- This is the indicator for the user's bet -->
      <div
        v-if="activeUserBet"
        class="userbet-indicator"
        :class="{
          'userbet-indicator--bullseye': ribbon === 'BULLSEYE',
          'userbet-indicator--half': ribbon === 'HALF',
          'userbet-indicator--miss': ribbon === 'MISS',
          'userbet-indicator--null': ribbon === null
        }"
        :style="calculateIndicatorPosition(activeUserBet.value, true, !isMatchStarted)"
      >
        <i
          class="pi"
          :class="{
            'pi-angle-left': isGridStarted,
            'pi-angle-up': !isGridStarted
          }"
          style="filter: drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black)"
        ></i>
      </div>
      <!-- This is the indicator for the correct margin -->
      <div
        v-if="correctMargin !== null"
        class="bet-indicator"
        :style="calculateIndicatorPosition(correctMargin !== null ? correctMargin : 4, false)"
      >
        <i
          class="pi"
          :class="{ 'pi-caret-left': isGridMode, 'pi-sort-up-fill': !isGridMode }"
          style="color: var(--bolao-c-white); filter: drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black)"
        ></i>
      </div>
      <TeamComponent
        :isAlias="isMobileOnly"
        :isGridMode="isGridMode"
        :isHomeTeam="false"
        :isWinning="match.away.score > match.home.score"
        :team="match.away"
        :matchStatus="match.status"
        :isMatchStarted="isMatchStarted"
        :odds="match.overUnder"
      />
      <TeamComponent
        :isAlias="isMobileOnly"
        :isGridMode="isGridMode"
        :isHomeTeam="true"
        :isWinning="match.away.score < match.home.score"
        :team="match.home"
        :matchStatus="match.status"
        :isMatchStarted="isMatchStarted"
        :odds="match.homeTeamOdds"
      />
    </div>
    <BettingComponent
      v-if="!isMatchStarted && activeProfile"
      :match="match"
      :activeUserBet="activeUserBet"
      :isMatchStarted="isMatchStarted"
    />
  </div>
</template>
<script lang="ts" setup>
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';
import { computed } from 'vue';
import { type Ribbon } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile.ts';
import type { IBet, IMatch } from '@/stores/matches.types';
import { calculateCorrectMargin } from '@/util/betsCalculator.ts';
import BettingComponent from './BettingComponent.vue';
import TeamComponent from './TeamComponent.vue';
const props = withDefaults(
  defineProps<{
    activeUserBet: IBet | null;
    isBetting?: boolean;
    isGridMode?: boolean;
    isMatchStarted: boolean;
    match: IMatch;
    ribbon?: Ribbon;
  }>(),
  {
    isBetting: false,
    isGridMode: false
  }
);

const activeProfileStore = useActiveProfileStore();
const indicatorPositionLine: Record<number, string> = {
  0: '12.5%',
  1: '37.5%',
  2: '62.5%',
  3: '87.5%',
  4: '50%'
};
const indicatorPositionGrid: Record<number, string> = {
  0: '10%',
  1: '40%',
  2: '60%',
  3: '90%',
  4: '50%'
};

// ------ Computed Properties ------
const activeProfile = computed(() => {
  return activeProfileStore.activeProfile;
});
const correctMargin = computed(() => calculateCorrectMargin(props.match.away.score, props.match.home.score));
const isGridStarted = computed(() => props.isGridMode && props.isMatchStarted);

// ------ Functions ------
function calculateIndicatorPosition(value: number, userIndicator: boolean, forceLineMode?: boolean) {
  if (forceLineMode || !props.isGridMode) {
    return {
      left: indicatorPositionLine[value],
      bottom: userIndicator ? '-15%' : '-8%',
      transform: 'translateX(-50%)'
    };
  } else {
    return {
      right: userIndicator ? '-3%' : '-1%',
      top: indicatorPositionGrid[value],
      transform: 'translateY(-50%)'
    };
  }
}
</script>
<style lang="scss" scoped>
.outer-score-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.outer-score-wrapper-mobile {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.outer-mobile-teams-grid {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.outer-mobile-teams-line {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 50px;
}

.outer-score-line {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  max-height: 50px;
}

.outer-score-grid {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.userbet-indicator {
  position: absolute;
  z-index: 99;
  display: flex;
  transition: all 0.2s;

  i {
    font-size: var(--m-font-size);
  }

  &--bullseye {
    color: var(--bolao-c-gold);
  }

  &--half {
    color: var(--bolao-c-blue);
  }

  &--miss {
    color: var(--bolao-c-red);
  }

  &--null {
    color: var(--bolao-c-white);
  }
}
.bet-indicator {
  position: absolute;
  z-index: 98;
  display: flex;
  transition: all 0.2s;
  color: white;
  i {
    font-size: var(--m-font-size);
  }
}
</style>
