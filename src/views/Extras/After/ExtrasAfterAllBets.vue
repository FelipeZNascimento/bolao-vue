<template>
  <ExtrasAfterAllBetsTable
    :title="conference"
    :conference="conference"
    :teamsWithBets="allUsersBetsByTeam.filter((bet) => bet.team.conference === conference)"
  />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useExtraBetStore } from '@/stores/extraBet';
import type { TConference } from '@/stores/matches.types';
import ExtrasAfterAllBetsTable from './ExtrasAfterAllBetsTable.vue';

defineProps<{
  conference: TConference;
}>();

const { allUsersBetsByTeam } = storeToRefs(useExtraBetStore());
</script>
<style lang="scss" scoped></style>
