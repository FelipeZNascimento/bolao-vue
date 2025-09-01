<template>
  <PrimeDialog
    v-if="team"
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    :style="{ width: '1024px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
    contentClass="content-class"
  >
    <div class="teams-outer">
      <TeamComponent isScoreless :isGridMode="false" :team="team" />
    </div>
    <div class="bets-outer" v-if="bets">
      <ExtrasBetsModalColumn
        :isCorrect="isCorrect(correctBetsByCategory.wildcard, team.id)"
        title="Wild Card"
        :users="[...bets.wildcard].sort((a, b) => a.name.localeCompare(b.name))"
      />
      <ExtrasBetsModalColumn
        title="Divisão"
        :users="[...bets.division].sort((a, b) => a.name.localeCompare(b.name))"
        :isCorrect="isCorrect(correctBetsByCategory.division, team.id)"
      />
      <ExtrasBetsModalColumn
        title="Conferência"
        :users="[...bets.conference].sort((a, b) => a.name.localeCompare(b.name))"
        :isCorrect="isCorrect(correctBetsByCategory.conference, team.id)"
      />
      <ExtrasBetsModalColumn
        title="Super Bowl"
        :users="[...bets.superbowl].sort((a, b) => a.name.localeCompare(b.name))"
        :isCorrect="
          !!(correctBetsByCategory.superbowl && correctBetsByCategory.superbowl.id === team.id)
        "
      />
    </div>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import TeamComponent from '@/components/Match/TeamComponent.vue';
import { type BetByCategory, type ExtrasTeam, useExtraBetStore } from '@/stores/extraBet';

import ExtrasBetsModalColumn from './ExtrasBetsModalColumn.vue';

const props = defineProps<{
  bets: BetByCategory | null;
  handleCloseModal: () => void;
  team: ExtrasTeam | null;
}>();

// ------ Initialization ------
const extraBetStore = useExtraBetStore();

// ------ Refs ------
const isVisible = ref(false);

// ------ Computed Properties ------
const correctBetsByCategory = computed(() => extraBetStore.correctBetsByCategory);

// ------ Functions ------
function isCorrect(correctBets: ExtrasTeam[], teamId: number) {
  return correctBets.find((element) => element.id === teamId) !== undefined;
}

watch(
  () => props.team,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style>
.teams-outer {
  display: flex;
  width: 100%;
  height: 60px;
}

.team-column {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.bets-outer {
  display: flex;
  overflow-x: hidden !important;
}

.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
}
</style>
