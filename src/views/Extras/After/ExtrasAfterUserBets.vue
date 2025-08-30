<template>
  <ExtrasResultTable
    v-for="(division, index) in divisionsObj"
    :key="index"
    :title="`${conference} ${division}`"
    :conference="conference"
    :teams="conferenceTeams[conference][division]"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { type Conference, type Division, useExtraBetStore } from '@/stores/extraBet';

import ExtrasResultTable from './ExtrasAfterUserTable.vue';

defineProps<{
  conference: Conference;
}>();

// ------ Initialization ------
const divisionsObj: Division[] = ['North', 'East', 'South', 'West'];
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const conferenceTeams = computed(() => {
  return {
    AFC: {
      East: extraBetStore.afcTeams.east,
      North: extraBetStore.afcTeams.north,
      South: extraBetStore.afcTeams.south,
      West: extraBetStore.afcTeams.west,
    },
    NFC: {
      East: extraBetStore.nfcTeams.east,
      North: extraBetStore.nfcTeams.north,
      South: extraBetStore.nfcTeams.south,
      West: extraBetStore.nfcTeams.west,
    },
  };
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
