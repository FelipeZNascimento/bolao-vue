<template>
  <ExtrasAfterAllBetsTable
    :title="conference"
    :conference="conference"
    :teamsWithBets="allUsersBetsByTeam.filter((bet) => bet.team.conference === conference)"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { type Conference, useExtraBetStore } from '@/stores/extraBet';

import ExtrasAfterAllBetsTable from './ExtrasAfterAllBetsTable.vue';

defineProps<{
  conference: Conference;
}>();

// ------ Initialization ------
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const allUsersBetsByTeam = computed(() => {
  return extraBetStore.allUsersBetsByTeam.filter(
    (team) =>
      team.bets.wildcard.length > 0 ||
      team.bets.division.length > 0 ||
      team.bets.conference.length > 0 ||
      team.bets.superbowl.length > 0,
  );
});
</script>
<style lang="scss" scoped>
.outer-extras {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-spacing);
  padding: var(--l-spacing) 160px;
  flex: 1;

  @media (max-width: 767px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.outer-extras-tables {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--l-spacing);
}
</style>
