<template>
  <ExtrasBettingTable
    title="AFC"
    :teams="sortedTeams.AFC"
    :selectedConferenceChampion="selectedConferenceChampions.AFC"
    :selectedSuperBowl="selectedSuperBowl"
    :handleSelectConferenceChampion="handleSelectChampion"
    :handleSelectSuperBowl="handleSelectSuperBowl"
  />
  <ExtrasBettingTable
    title="NFC"
    :teams="sortedTeams.NFC"
    :selectedConferenceChampion="selectedConferenceChampions.NFC"
    :selectedSuperBowl="selectedSuperBowl"
    :handleSelectConferenceChampion="handleSelectChampion"
    :handleSelectSuperBowl="handleSelectSuperBowl"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { TConferenceChampions, TExtrasTeam } from '@/stores/extraBet.types';
import type { TConference, TDivision } from '@/stores/matches.types';
import { useTeamsStore } from '@/stores/teams';
import ExtrasBettingTable from '@/views/Extras/Before/ExtrasBettingTable.vue';

defineProps<{
  handleSelectChampion: (conference: TConference, division: TDivision, team: TExtrasTeam) => void;
  handleSelectSuperBowl: (team: TExtrasTeam) => void;
  selectedConferenceChampions: TConferenceChampions;
  selectedSuperBowl: null | TExtrasTeam;
}>();

// ------ Initialization ------
const teamsStore = useTeamsStore();

// ------ Computed Properties ------
const sortedTeams = computed(() => {
  const AFC = [
    ...teamsStore.afcTeams.North,
    ...teamsStore.afcTeams.East,
    ...teamsStore.afcTeams.South,
    ...teamsStore.afcTeams.West
  ].sort((a, b) => a.name.localeCompare(b.name));

  const NFC = [
    ...teamsStore.nfcTeams.North,
    ...teamsStore.nfcTeams.East,
    ...teamsStore.nfcTeams.South,
    ...teamsStore.nfcTeams.West
  ].sort((a, b) => a.name.localeCompare(b.name));

  return { AFC, NFC };
});
</script>
