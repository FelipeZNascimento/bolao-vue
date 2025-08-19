<template>
  <div style="position: relative">
    <!-- :disabled="isLoading || isMatchStarted" -->
    <PrimeRadioButton
      v-for="(BET_VALUE, index) in BETS_VALUES"
      :key="index"
      :name="BETS_LABELS[BET_VALUE]"
      :value="BET_VALUE"
      v-model="radioButton"
      class="betting-radio-button"
      size="large"
      @change="(e: any) => handleNewBet(e, BET_VALUE)"
      v-tooltip.top="renderTootlip(BET_VALUE)"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { BETS_VALUES, BETS_LABELS, type BetsValues } from '@/constants/bets';
import MatchService from '@/services/match';
import type { Bet, Match } from '@/stores/matches';
import { useToast } from 'primevue/usetoast';
import { useClockStore } from '@/stores/clock';

const props = defineProps<{
  match: Match;
  activeUserBet: Bet | null;
}>();

// ------ Refs ------
const radioButtonPrevValue = ref<BetsValues | null>(null);
const radioButton = ref<BetsValues | null>(null);
const isLoading = ref<boolean>(false);

// ------ Initializations ------
const matchService = new MatchService();
const toast = useToast();
const clockStore = useClockStore();

// ------ Computed Properties ------
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

// ------ Watch Effect Properties ------
watchEffect(() => (radioButton.value = props.activeUserBet ? props.activeUserBet.value : null));
watchEffect(
  () => (radioButtonPrevValue.value = props.activeUserBet ? props.activeUserBet.value : null),
);

// ------ Functions ------
function renderTootlip(value: BetsValues) {
  if (value === BETS_VALUES.AWAY_EASY || value === BETS_VALUES.AWAY_HARD) {
    return `${BETS_LABELS[value]} pros ${props.match.away.alias}`;
  } else {
    return `${BETS_LABELS[value]} para ${props.match.home.alias}`;
  }
}

function handleNewBet(e: Event, newBet: BetsValues) {
  console.log(`e: ${e.target as HTMLInputElement}`);
  console.log(`e: ${JSON.stringify(e.target)}`);
  isLoading.value = true;

  // If nothing changed, do not update the bet
  if (radioButtonPrevValue.value === radioButton.value) {
    callback(true);
  }

  matchService.updateBet(props.match.id, newBet, callback);
}

function callback(isSuccess: boolean, error?: Error) {
  isLoading.value = false;
  if (isSuccess) {
    radioButtonPrevValue.value = radioButton.value; // Update previous value to current
    console.log('Bet updated successfully');
    toast.add({
      severity: 'success',
      summary: 'Aposta atualizada',
      detail: `Aposta ${props.match.away.code} @ ${props.match.home.code} atualizada com sucesso`,
      life: 3000,
    });
  } else {
    radioButton.value = radioButtonPrevValue.value; // Revert to previous value
    console.error('Error updating bet:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro ao atualizar aposta',
      detail: `Erro ao atualizar aposta: ${error?.message}`,
      life: 5000,
    });
  }
}
</script>
<style lang="scss" scoped>
.betting-radio-button {
  margin: var(--xs-spacing);
}
</style>
