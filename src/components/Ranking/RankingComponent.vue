<template>
  <div class="outer-ranking">
    <div class="ranking-header">
      <span
        class="toggle"
        :class="{ activeToggle: !isWeeklyRanking }"
        @click="isWeeklyRanking = false"
        >Temporada</span
      >
      <PrimeToggleSwitch v-model="isWeeklyRanking" />
      <span
        class="toggle"
        :class="{ activeToggle: isWeeklyRanking }"
        @click="isWeeklyRanking = true"
        >Semana</span
      >
      <div class="table-config" @click="isConfigModalOpen = true"><i class="pi pi-cog"></i></div>
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
  <ConfigModal
    :isOpen="isConfigModalOpen"
    :columnConfig="columnsOption"
    :rowSpacingConfig="rowSpacing"
    :handlRowSpacingConfig="handlRowSpacingConfig"
    :handleColumnConfig="handleColumnConfig"
    :handleCloseModal="handleCloseModal"
  />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useConfigurationStore } from '@/stores/configuration';
import { useRankingStore, type ColumnsOption, type RowSpacing } from '@/stores/ranking';
import { useActiveProfileStore } from '@/stores/activeProfile';
import ConfigModal from '@/components/Ranking/ConfigModal.vue';
import RankingTable from './RankingTable.vue';

// ------ Refs ------
const isWeeklyRanking = ref(false);
const isConfigModalOpen = ref(false);

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

function handleColumnConfig(newOption: ColumnsOption) {
  console.log(`handleColumnConfig -> ${newOption}`);
  rankingStore.setColumnsOption(newOption);
}

function handlRowSpacingConfig(newOption: RowSpacing) {
  console.log(`handlRowSpacingConfig -> ${newOption}`);
  rankingStore.setRowSpacing(newOption);
}
</script>
<style scoped>
.outer-ranking {
  top: 80px;
  right: 0;

  position: sticky;
  flex: 1;
  border-left: 1px solid var(--color-background-mute);
  width: 460px;
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

.table-config {
  position: absolute;
  top: 0;
  right: var(--xs-spacing);
  height: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;

  i {
    font-size: var(--l-font-size);
    transition: 0.2s;
  }

  &:hover {
    i {
      color: var(--color-contrast);
    }
  }
}

.error-message {
  width: 100%;
  margin: var(--xl-spacing) 0;
}
</style>
