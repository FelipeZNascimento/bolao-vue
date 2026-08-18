<template>
  <ExtrasAfterAllBetsTable
    :title="conference"
    :conference="conference"
    :teamsWithBets="allUsersBetsByTeam.filter((bet) => bet.team.conference === conference)"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useExtraBetStore } from '@/stores/extraBet';
import type { TConference } from '@/stores/matches.types';
import ExtrasAfterAllBetsTable from './ExtrasAfterAllBetsTable.vue';

defineProps<{
  conference: TConference;
}>();

// ------ Initialization ------
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const allUsersBetsByTeam = computed(() => extraBetStore.allUsersBetsByTeam);
</script>
<style lang="scss" scoped></style>
