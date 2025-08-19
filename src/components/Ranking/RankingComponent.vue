<template>
  <div class="outer-ranking">
    <div class="ranking-header">
      <span
        class="toggle"
        :class="{ activeToggle: !isWeeklyRanking }"
        @click="isWeeklyRanking = false"
      >
        Temporada</span
      >
      <PrimeToggleSwitch v-model="isWeeklyRanking" />
      <span
        class="toggle"
        :class="{ activeToggle: isWeeklyRanking }"
        @click="isWeeklyRanking = true"
      >
        Semana
      </span>
    </div>
    <div class="ranking-container">
      <RankingTable
        :isWeekly="isWeeklyRanking"
        :isLoading="isWeeklyRanking ? isLoadingWeek : isLoadingSeason"
        :rankingData="isWeeklyRanking ? currentWeekRanking : seasonRanking"
        :columnConfig="columnsOption"
        :rowSpacingConfig="rowSpacing"
        :activeProfile="activeProfile"
        :error="isWeeklyRanking ? errorSeason : errorWeek"
      />
    </div>
  </div>
  <ConfigModal :isOpen="isConfigModalOpen" :handleCloseModal="handleCloseModal" />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useConfigurationStore } from '@/stores/configuration';
import { useRankingStore } from '@/stores/ranking';
import { useActiveProfileStore } from '@/stores/activeProfile';
import ConfigModal from '@/components/Ranking/ConfigModal.vue';
import RankingTable from './RankingTable.vue';

// ------ Refs ------
const isWeeklyRanking = ref(false);
const isConfigModalOpen = ref(false);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const rankingStore = useRankingStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties  ------
const columnsOption = computed(() => rankingStore.columnsOption);
const rowSpacing = computed(() => rankingStore.rowSpacing);
const errorWeek = computed(() => rankingStore.errorWeek);
const errorSeason = computed(() => rankingStore.errorSeason);
const isLoadingWeek = computed(() => configurationStore.isLoading || rankingStore.isLoadingWeek);
const isLoadingSeason = computed(
  () => configurationStore.isLoading || rankingStore.isLoadingSeason,
);
const seasonRanking = computed(() => rankingStore.seasonRanking);
const currentWeekRanking = computed(() => rankingStore.currentWeekRanking);
const activeProfile = computed(() => activeProfileStore.activeProfile);

// ------ Functions  ------
function handleCloseModal() {
  isConfigModalOpen.value = false;
}
</script>
<style scoped>
.outer-ranking {
  top: 80px;
  right: 0;

  position: sticky;
  border-left: 1px solid var(--color-background-mute);
  min-width: 480px;
  width: 480px;
  max-height: calc(100vh - 80px);
}

.ranking-container {
  max-height: calc(100% - 50px);
  overflow-y: auto;
}
.outer-position {
  display: flex;
  gap: var(--s-spacing);
}
.ranking-header {
  display: flex;
  gap: var(--s-spacing);
  justify-content: center;
  align-items: center;
  padding: var(--s-spacing) 0;
  font-size: var(--m-font-size);
  height: 50px;
}

.skeleton-ranking-line {
  /* width: 100%; */
  height: 40px !important;
  margin: var(--xs-spacing) 0;
}

.toggle {
  cursor: pointer;
  transition: 0.2s;
}

.activeToggle {
  color: var(--color-contrast);
  text-decoration: underline;
}

.error-message {
  width: 100%;
  margin: var(--xl-spacing) 0;
}
</style>
