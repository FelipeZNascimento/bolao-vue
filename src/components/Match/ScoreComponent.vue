<template>
  <div
    v-if="isMobileOnly"
    class="outer-mobile-score-line"
  >
    <div
      :class="{
        'outer-mobile-teams-line': !isGridMode || isBetting,
        'outer-mobile-teams-grid': isGridMode
      }"
      style="position: relative"
    >
      <RibbonComponent
        v-if="ribbon"
        :ribbon="ribbon"
      />
      <div
        v-if="activeUserBet"
        class="userbet-indicator"
        :style="{ left: indicatorPosition[activeUserBet.value] }"
      >
        <i
          class="pi pi-angle-up"
          :class="{ green: activeUserBet.value === correctMargin, white: activeUserBet.value !== correctMargin }"
          style="filter: drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black)"
        ></i>
      </div>
      <div
        v-if="correctMargin !== null"
        class="bet-indicator"
        :style="{ left: indicatorPosition[correctMargin !== null ? correctMargin : 1] }"
      >
        <i
          class="pi pi-sort-up-fill"
          style="color: var(--bolao-c-white); filter: drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black)"
        ></i>
      </div>
      <TeamComponent
        isAlias
        :isGridMode="isGridMode"
        :isHomeTeam="false"
        :isWinning="match.away.score > match.home.score"
        :team="match.away"
        :matchStatus="match.status"
        :odds="!isMatchStarted ? match.overUnder : ''"
      />
      <TeamComponent
        isAlias
        :isGridMode="isGridMode"
        :isHomeTeam="true"
        :isWinning="match.away.score < match.home.score"
        :team="match.home"
        :matchStatus="match.status"
        :odds="!isMatchStarted ? match.homeTeamOdds : ''"
      />
    </div>
    <BettingComponent
      v-if="!isGridMode && !isMatchStarted && activeProfile"
      :match="match"
      :activeUserBet="activeUserBet"
      :isMatchStarted="isMatchStarted"
    />
  </div>
  <div
    style="display: flex; flex-direction: column; flex: 1"
    v-else
  >
    <div
      :class="{ 'outer-score-line': !isGridMode || isBetting, 'outer-score-grid': isGridMode }"
      style="position: relative"
    >
      <div
        v-if="activeUserBet"
        class="userbet-indicator"
        :style="{ left: indicatorPosition[activeUserBet.value] }"
      >
        <i
          class="pi pi-angle-up"
          :class="{ green: activeUserBet.value === correctMargin, white: activeUserBet.value !== correctMargin }"
          style="filter: drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black)"
        ></i>
      </div>
      <div
        v-if="correctMargin !== null"
        class="bet-indicator"
        :style="{ left: indicatorPosition[correctMargin !== null ? correctMargin : 1] }"
      >
        <i
          class="pi pi-sort-up-fill"
          style="color: var(--bolao-c-white); filter: drop-shadow(0px 0px 1px black) drop-shadow(0px 0px 1px black)"
        ></i>
      </div>
      <TeamComponent
        :isGridMode="isGridMode"
        :isHomeTeam="false"
        :isWinning="match.away.score > match.home.score"
        :team="match.away"
        :odds="!isMatchStarted ? match.overUnder : ''"
        :matchStatus="match.status"
      />
      <TeamComponent
        :isGridMode="isGridMode"
        :isHomeTeam="true"
        :isWinning="match.away.score < match.home.score"
        :team="match.home"
        :odds="!isMatchStarted ? match.homeTeamOdds : ''"
        :matchStatus="match.status"
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
import { BETS_VALUES, type Ribbon } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile.ts';
import type { IBet, IMatch } from '@/stores/matches.types';
import { calculateCorrectMargin } from '@/util/betsCalculator.ts';
import BettingComponent from './BettingComponent.vue';
import RibbonComponent from './RibbonComponent.vue';
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
const indicatorPosition: Record<number, string> = {
  0: '12.5%',
  1: '37.5%',
  2: '62.5%',
  3: '87.5%'
};

// ------ Computed Properties ------
const activeProfile = computed(() => {
  return activeProfileStore.activeProfile;
});
const correctMargin = computed(() => calculateCorrectMargin(props.match.away.score, props.match.home.score));
</script>
<style scoped>
.outer-mobile-score-line {
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
  gap: var(--s-spacing);
}

.outer-score-grid {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.userbet-indicator {
  position: absolute;
  z-index: 999;
  bottom: -8px;
  display: flex;
  transform: translateX(-50%);
  transition: all 0.2s;

  i {
    font-size: var(--m-font-size);
  }
}
.bet-indicator {
  position: absolute;
  z-index: 990;
  bottom: -4px;
  display: flex;
  transform: translateX(-50%);
  transition: all 0.2s;
  color: white;
  i {
    font-size: var(--m-font-size);
  }
}

.green {
  color: var(--bolao-c-green);
}
.white {
  color: var(--bolao-c-white);
}
</style>
