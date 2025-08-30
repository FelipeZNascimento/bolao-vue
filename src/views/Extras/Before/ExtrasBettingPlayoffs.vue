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

import {
  type Conference,
  type Division,
  type ExtrasTeam,
  useExtraBetStore,
} from '@/stores/extraBet';
import ExtrasBettingTable from '@/views/Extras/Before/ExtrasBettingTable.vue';

import type { ConferenceChampions } from '../types';

defineProps<{
  handleSelectChampion: (conference: Conference, division: Division, team: ExtrasTeam) => void;
  handleSelectSuperBowl: (team: ExtrasTeam) => void;
  selectedConferenceChampions: ConferenceChampions;
  selectedSuperBowl: ExtrasTeam | null;
}>();

// ------ Initialization ------
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const sortedTeams = computed(() => {
  const AFC = [
    ...extraBetStore.afcTeams.north,
    ...extraBetStore.afcTeams.east,
    ...extraBetStore.afcTeams.south,
    ...extraBetStore.afcTeams.west,
  ].sort((a, b) => a.name.localeCompare(b.name));

  const NFC = [
    ...extraBetStore.nfcTeams.north,
    ...extraBetStore.nfcTeams.east,
    ...extraBetStore.nfcTeams.south,
    ...extraBetStore.nfcTeams.west,
  ].sort((a, b) => a.name.localeCompare(b.name));

  return { AFC, NFC };
});
</script>
