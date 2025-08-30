<template>
  <div v-if="isMobileOnly" class="outer-mobile-score-line">
    <span
      :class="{
        'outer-mobile-teams-line': !isGridMode || isBetting,
        'outer-mobile-teams-grid': isGridMode,
      }"
    >
      <TeamComponent isAlias :isGridMode="isGridMode" :isHomeTeam="false" :team="match.away" />
      <TeamComponent isAlias :isGridMode="isGridMode" :isHomeTeam="true" :team="match.home" />
    </span>
    <BettingComponent
      v-if="isBetting && !isGridMode"
      :match="match"
      :activeUserBet="activeUserBet"
    />
  </div>
  <div
    v-else
    :class="{ 'outer-score-line': !isGridMode || isBetting, 'outer-score-grid': isGridMode }"
  >
    <TeamComponent
      :isAlias="isBetting"
      :isGridMode="isGridMode"
      :isHomeTeam="false"
      :team="match.away"
    />
    <BettingComponent
      v-if="isBetting && !isGridMode"
      :match="match"
      :activeUserBet="activeUserBet"
    />
    <TeamComponent
      :isAlias="isBetting"
      :isGridMode="isGridMode"
      :isHomeTeam="true"
      :team="match.home"
    />
  </div>
</template>
<script lang="ts" setup>
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';

import type { Bet, Match } from '@/stores/matches';

import BettingComponent from './BettingComponent.vue';
import TeamComponent from './TeamComponent.vue';
withDefaults(
  defineProps<{
    activeUserBet: Bet | null;
    isBetting?: boolean;
    isGridMode?: boolean;
    match: Match;
  }>(),
  {
    isBetting: false,
    isGridMode: false,
  },
);
</script>
<style scoped>
.outer-mobile-score-line {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-spacing);
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
  min-height: 60px;
}

.outer-score-line {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.outer-score-grid {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
