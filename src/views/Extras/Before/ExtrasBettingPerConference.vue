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
import type { TConference, TDivision, TDivisionChampions, TExtrasTeam } from '@/stores/extraBet.types';
import { useTeamsStore } from '@/stores/teams';
import ExtrasBettingTable from '@/views/Extras/Before/ExtrasBettingTable.vue';

const props = defineProps<{
  conference: TConference;
  handleSelectChampion: (conference: TConference, division: TDivision, team: TExtrasTeam) => void;
  handleSelectWildcard: (conference: TConference, team: TExtrasTeam) => void;
  selectedDivisionChampions: TDivisionChampions;
  selectedWildcards: TExtrasTeam[];
}>();

// ------ Initialization ------
const teamsStore = useTeamsStore();
const divisionsObj: TDivision[] = ['North', 'East', 'South', 'West'];

// ------ Computed Properties ------
const conferenceTeams = computed(() => {
  if (props.conference === 'NFC') {
    return {
      East: teamsStore.nfcTeams.East,
      North: teamsStore.nfcTeams.North,
      South: teamsStore.nfcTeams.South,
      West: teamsStore.nfcTeams.West
    };
  } else {
    return {
      East: teamsStore.afcTeams.East,
      North: teamsStore.afcTeams.North,
      South: teamsStore.afcTeams.South,
      West: teamsStore.afcTeams.West
    };
  }
});
</script>
