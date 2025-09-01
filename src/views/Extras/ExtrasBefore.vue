<template>
  <div class="outer-extras">
    <h1>Extras</h1>
    <PrimeSelectButton
      :allowEmpty="false"
      size="small"
      v-model="selectedToggle"
      :options="buttonOptions"
    />
    <div v-if="isLoading" class="extras-betting-table-skeleton-outer">
      <PrimeSkeleton class="skeleton" />
      <PrimeSkeleton class="skeleton" />
    </div>
    <div v-else-if="selectedToggle === 'Playoffs'" class="outer-extras-tables">
      <ExtrasBettingPlayoffs
        :selectedConferenceChampions="selectedConferenceChampions"
        :selectedSuperBowl="selectedSuperBowl"
        :handleSelectChampion="handleSelectChampion"
        :handleSelectSuperBowl="handleSelectSuperBowl"
      />
    </div>
    <div v-else class="outer-extras-tables">
      <ExtrasBettingPerConference
        :conference="selectedToggle"
        :conferenceTeams="selectedToggle === 'AFC' ? afcTeams : nfcTeams"
        :selectedDivisionChampions="selectedDivisionChampions"
        :selectedWildcards="selectedWildcards[selectedToggle]"
        :handleSelectChampion="handleSelectChampion"
        :handleSelectWildcard="handleSelectWildcard"
      />
    </div>
  </div>
  <ExtrasBettingCounter
    alignment="left"
    conference="AFC"
    :selectedConferenceChampion="selectedConferenceChampions.AFC"
    :selectedDivisionChampions="selectedDivisionChampions.AFC"
    :selectedWildcards="selectedWildcards.AFC"
    :selectedSuperBowlWinner="selectedSuperBowl"
  />
  <ExtrasBettingCounter
    alignment="right"
    conference="NFC"
    :selectedConferenceChampion="selectedConferenceChampions.NFC"
    :selectedDivisionChampions="selectedDivisionChampions.NFC"
    :selectedWildcards="selectedWildcards.NFC"
    :selectedSuperBowlWinner="selectedSuperBowl"
  />
</template>
<script setup lang="ts">
import { useToast } from 'primevue';
import { computed, ref, watchEffect } from 'vue';

import { EXTRA_BETS_VALUES } from '@/constants/bets';
import ExtraBetService from '@/services/extra_bet';
import {
  type Conference,
  type Division,
  type ExtrasTeam,
  useExtraBetStore,
} from '@/stores/extraBet';

import type {
  ConferenceChampions,
  DivisionChampions,
  ExtrasBeforeToggle,
  Wildcards,
} from './types';

import ExtrasBettingCounter from './Before/ExtrasBettingCounter.vue';
import ExtrasBettingPerConference from './Before/ExtrasBettingPerConference.vue';
import ExtrasBettingPlayoffs from './Before/ExtrasBettingPlayoffs.vue';

// ------ Refs ------
const selectedToggle = ref<ExtrasBeforeToggle>('AFC');
const buttonOptions = ref<ExtrasBeforeToggle[]>(['AFC', 'NFC', 'Playoffs']);
const selectedConferenceChampions = ref<ConferenceChampions>({
  AFC: null,
  NFC: null,
});
const selectedDivisionChampions = ref<DivisionChampions>({
  AFC: {
    East: null,
    North: null,
    South: null,
    West: null,
  },
  NFC: {
    East: null,
    North: null,
    South: null,
    West: null,
  },
});
const selectedWildcards = ref<Wildcards>({
  AFC: [],
  NFC: [],
});
const selectedSuperBowl = ref<ExtrasTeam | null>(null);

// ------ Initialization ------
const extraBetService = new ExtraBetService();
const extraBetStore = useExtraBetStore();
const toast = useToast();

// ------ Computed Properties ------
const isLoading = computed(() => extraBetStore.isLoading);
const loggedUserBets = computed(() => extraBetStore.normalizedLoggedUserBets);
const afcTeams = computed(() => {
  return {
    East: extraBetStore.afcTeams.east,
    North: extraBetStore.afcTeams.north,
    South: extraBetStore.afcTeams.south,
    West: extraBetStore.afcTeams.west,
  };
});

const nfcTeams = computed(() => {
  return {
    East: extraBetStore.nfcTeams.east,
    North: extraBetStore.nfcTeams.north,
    South: extraBetStore.nfcTeams.south,
    West: extraBetStore.nfcTeams.west,
  };
});

// ------ Watch Effects ------
watchEffect(() => (selectedConferenceChampions.value = loggedUserBets.value.conferenceChampions));
watchEffect(() => (selectedDivisionChampions.value = loggedUserBets.value.divisionChampions));
watchEffect(() => (selectedWildcards.value = loggedUserBets.value.wildcards));
watchEffect(() => (selectedSuperBowl.value = loggedUserBets.value.superbowl));

// ------ Functions ------

function fillSelectedFromStore() {
  selectedConferenceChampions.value = loggedUserBets.value.conferenceChampions;
  selectedDivisionChampions.value = loggedUserBets.value.divisionChampions;
  selectedWildcards.value = loggedUserBets.value.wildcards;
  selectedSuperBowl.value = loggedUserBets.value.superbowl;
}

function handleSelectChampion(conference: Conference, division: Division, team: ExtrasTeam) {
  if (selectedToggle.value === 'Playoffs') {
    // If the clicked conference champion is the currently selected, remove it
    if (selectedConferenceChampions.value[conference]?.id === team.id) {
      selectedConferenceChampions.value = {
        ...selectedConferenceChampions.value,
        [conference]: null,
      };
    } else {
      selectedConferenceChampions.value = {
        ...selectedConferenceChampions.value,
        [conference]: team,
      };
    }
  } else {
    // Add/replace current selected conference champion
    if (selectedDivisionChampions.value[conference][division]?.id === team.id) {
      selectedDivisionChampions.value = {
        ...selectedDivisionChampions.value,
        [conference]: {
          ...selectedDivisionChampions.value?.[conference],
          [division]: null,
        },
      };
    } else {
      selectedDivisionChampions.value = {
        ...selectedDivisionChampions.value,
        [conference]: {
          ...selectedDivisionChampions.value?.[conference],
          [division]: team,
        },
      };
    }
  }

  triggerUpdate();
}

function handleSelectSuperBowl(team: ExtrasTeam) {
  if (selectedSuperBowl.value?.id === team.id) {
    selectedSuperBowl.value = null;
  } else {
    selectedSuperBowl.value = team;
  }

  triggerUpdate();
}

function handleSelectWildcard(conference: Conference, team: ExtrasTeam) {
  const currentWildcards = selectedWildcards.value[conference];
  if (currentWildcards.find((t) => t.id === team.id)) {
    // If the clicked wild card is in the current selected wild cards, remove it
    selectedWildcards.value = {
      ...selectedWildcards.value,
      [conference]: currentWildcards.filter((t) => t.id !== team.id),
    };

    triggerUpdate();
  } else if (selectedWildcards.value[conference].length < 3) {
    // If there's still space for wild cards, add it
    selectedWildcards.value = {
      ...selectedWildcards.value,
      [conference]: [...currentWildcards, team],
    };

    triggerUpdate();
  } else {
    // If the user is trying to add a 4th wild card, trigger toast
    toast.add({
      detail: `Para escolher uma nova equipa, remova a aposta numa das equipes já selecionadas`,
      life: 5000,
      severity: 'info',
      summary: 'Máximo de 3 wild cards por Conferência',
    });
  }
}

function triggerUpdate() {
  const updateObject = {
    [EXTRA_BETS_VALUES.AFC]: selectedConferenceChampions.value.AFC?.id || null,
    [EXTRA_BETS_VALUES.AFC_EAST]: selectedDivisionChampions.value.AFC.East?.id || null,
    [EXTRA_BETS_VALUES.AFC_NORTH]: selectedDivisionChampions.value.AFC.North?.id || null,
    [EXTRA_BETS_VALUES.AFC_SOUTH]: selectedDivisionChampions.value.AFC.South?.id || null,
    [EXTRA_BETS_VALUES.AFC_WEST]: selectedDivisionChampions.value.AFC.West?.id || null,
    [EXTRA_BETS_VALUES.AFC_WILDCARD]: selectedWildcards.value.AFC.map((team) => team.id),
    [EXTRA_BETS_VALUES.NFC]: selectedConferenceChampions.value.NFC?.id || null,
    [EXTRA_BETS_VALUES.NFC_EAST]: selectedDivisionChampions.value.NFC.East?.id || null,
    [EXTRA_BETS_VALUES.NFC_NORTH]: selectedDivisionChampions.value.NFC.North?.id || null,
    [EXTRA_BETS_VALUES.NFC_SOUTH]: selectedDivisionChampions.value.NFC.South?.id || null,
    [EXTRA_BETS_VALUES.NFC_WEST]: selectedDivisionChampions.value.NFC.West?.id || null,
    [EXTRA_BETS_VALUES.NFC_WILDCARD]: selectedWildcards.value.NFC.map((team) => team.id),
    [EXTRA_BETS_VALUES.SUPERBOWL]: selectedSuperBowl.value?.id || null,
  };

  extraBetService.update(updateObject, updateCallback);
}

function updateCallback(isSuccess: boolean, error?: Error) {
  if (isSuccess) {
    console.log('Bet updated successfully');
    toast.add({
      life: 3000,
      severity: 'success',
      summary: 'Aposta extra atualizada',
    });
  } else {
    // Revert to previous values
    fillSelectedFromStore();

    console.error('Error updating bet:', error);
    toast.add({
      detail: `${error?.message}`,
      life: 5000,
      severity: 'error',
      summary: 'Erro ao atualizar aposta',
    });
  }
}
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
.extras-betting-table-skeleton-outer {
  display: flex;
  gap: var(--l-spacing);
  width: 100%;

  @media (max-width: 767px) {
    flex-direction: column;
  }
  .skeleton {
    min-width: 400px;
    width: 400px;
    height: 400px !important;

    @media (max-width: 767px) {
      width: 100% !important;
      min-width: 100% !important;
    }
  }
}
</style>
