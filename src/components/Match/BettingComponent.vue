<template>
  <div style="display: flex; flex: 1; width: 100%; min-height: 40px">
    <PrimeSelectButton
      :disabled="isLoading || isMatchStarted"
      v-model="radioButton"
      :options="Object.values(BETS_VALUES)"
      aria-labelledby="custom"
      style="flex: 1; width: 100%"
      size="small"
      @value-change="handleNewBet"
      fluid
    >
      <template #option="slotProps">
        <span v-tooltip.top="renderTooltip(slotProps.option)">{{ BETS_LABELS[slotProps.option] }}</span>
      </template>
    </PrimeSelectButton>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref, watchEffect } from 'vue';
import { BETS_LABELS, BETS_VALUES, type BetsValues } from '@/constants/bets';
import MatchService from '@/services/match';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useMatchesStore } from '@/stores/matches';
import type { IBet, IMatch } from '@/stores/matches.types';

const props = defineProps<{
  activeUserBet: IBet | null;
  isMatchStarted: boolean;
  match: IMatch;
}>();

// ------ Refs ------
const radioButtonPrevValue = ref<BetsValues | null>(null);
const radioButton = ref<BetsValues | null>(null);
const isLoading = ref<boolean>(false);

// ------ Initializations ------
const matchService = new MatchService();
const matchesStore = useMatchesStore();
const toast = useToast();
const { activeProfile } = storeToRefs(useActiveProfileStore());

// ------ Watch Effect Properties ------
watchEffect(() => (radioButton.value = props.activeUserBet ? props.activeUserBet.value : null));
watchEffect(() => (radioButtonPrevValue.value = props.activeUserBet ? props.activeUserBet.value : null));

function callback(isSuccess: boolean, error?: Error) {
  isLoading.value = false;
  if (isSuccess) {
    radioButtonPrevValue.value = radioButton.value; // Update previous value to current
    if (radioButton.value !== null && activeProfile.value) {
      matchesStore.updateLoggedUserBet(props.match.id, radioButton.value, activeProfile.value);
    }
    toast.add({
      detail: `Aposta ${props.match.away.code} @ ${props.match.home.code} atualizada com sucesso`,
      life: 3000,
      severity: 'success',
      summary: 'Aposta atualizada'
    });
  } else {
    radioButton.value = radioButtonPrevValue.value; // Revert to previous value
    console.error('Error updating bet:', error);
    toast.add({
      detail: `Erro ao atualizar aposta: ${error?.message}`,
      life: 5000,
      severity: 'error',
      summary: 'Erro ao atualizar aposta'
    });
  }
}

function handleNewBet() {
  isLoading.value = true;

  // If nothing changed, do not update the bet
  if (radioButtonPrevValue.value === radioButton.value || radioButton.value === null) {
    return callback(true);
  }

  matchService.updateBet(props.match.id, radioButton.value, callback);
}

// ------ Functions ------
function renderTooltip(value: BetsValues) {
  console.log(value);
  if (value === BETS_VALUES.AWAY_EASY || value === BETS_VALUES.AWAY_HARD) {
    return `${BETS_LABELS[value]} pros ${props.match.away.alias}`;
  } else {
    return `${BETS_LABELS[value]} pros ${props.match.home.alias}`;
  }
}
</script>

<style lang="scss">
.p-selectbutton .p-togglebutton {
  border-width: 0px !important;
}
</style>
