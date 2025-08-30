<template>
  <ExtrasBettingTable
    v-for="(division, index) in divisionsObj"
    :key="index"
    :title="`${conference} ${division}`"
    :teams="conferenceTeams[division]"
    :selectedChampion="selectedDivisionChampions[conference][division]"
    :selectedWildcards="selectedWildcards"
    :handleSelectChampion="handleSelectChampion"
    :handleSelectWildcard="handleSelectWildcard"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';

import {
  type Conference,
  type Division,
  type ExtrasTeam,
  useExtraBetStore,
} from '@/stores/extraBet';
import ExtrasBettingTable from '@/views/Extras/Before/ExtrasBettingTable.vue';

import type { DivisionChampions } from '../types';

const props = defineProps<{
  conference: Conference;
  handleSelectChampion: (conference: Conference, division: Division, team: ExtrasTeam) => void;
  handleSelectWildcard: (conference: Conference, team: ExtrasTeam) => void;
  selectedDivisionChampions: DivisionChampions;
  selectedWildcards: ExtrasTeam[];
}>();

// ------ Initialization ------
const extraBetStore = useExtraBetStore();
const divisionsObj: Division[] = ['North', 'East', 'South', 'West'];

// ------ Computed Properties ------
const conferenceTeams = computed(() => {
  if (props.conference === 'NFC') {
    return {
      East: extraBetStore.nfcTeams.east,
      North: extraBetStore.nfcTeams.north,
      South: extraBetStore.nfcTeams.south,
      West: extraBetStore.nfcTeams.west,
    };
  } else {
    return {
      East: extraBetStore.afcTeams.east,
      North: extraBetStore.afcTeams.north,
      South: extraBetStore.afcTeams.south,
      West: extraBetStore.afcTeams.west,
    };
  }
});
</script>
