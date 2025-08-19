<template>
  <div :class="{ 'outer-score-line': !isGridMode, 'outer-score-grid': isGridMode }">
    <TeamComponent :isGridMode="isGridMode" :isHomeTeam="false" :team="match.away" />
    <BettingComponent
      v-if="isBetting && !isGridMode"
      :match="match"
      :activeUserBet="activeUserBet"
    />
    <TeamComponent :isGridMode="isGridMode" :isHomeTeam="true" :team="match.home" />
  </div>
</template>
<script lang="ts" setup>
import type { Bet, Match } from '@/stores/matches';
import TeamComponent from './TeamComponent.vue';
import BettingComponent from './BettingComponent.vue';
withDefaults(
  defineProps<{
    match: Match;
    activeUserBet: Bet | null;
    isGridMode?: boolean;
    isBetting?: boolean;
  }>(),
  {
    isGridMode: false,
    isBetting: false,
  },
);
</script>
<style scoped>
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
