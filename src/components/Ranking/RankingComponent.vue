<template>
  <div :class="{ 'outer-ranking': !isModal }">
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
      <button
        v-if="activeProfile && activeProfile.favorites?.length"
        class="favorites-filter-btn"
        :class="{ 'favorites-filter-btn--active': showOnlyFavorites }"
        @click="showOnlyFavorites = !showOnlyFavorites"
        v-tooltip.top="showOnlyFavorites ? 'Mostrar todos' : 'Mostrar favoritos'"
      >
        <i
          class="pi"
          :class="showOnlyFavorites ? 'pi-star-fill' : 'pi-star'"
        />
      </button>
    </div>
    <div class="ranking-container">
      <RankingTable
        :isWeekly="isWeeklyRanking"
        :isLoading="isWeeklyRanking ? isLoadingWeek : isLoadingSeason"
        :rankingData="isWeeklyRanking ? filteredWeekRanking : filteredSeasonRanking"
        :columnConfig="columnsOption"
        :rowSpacingConfig="rowSpacing"
        :activeProfile="activeProfile"
        :error="isWeeklyRanking ? errorSeason : errorWeek"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useRankingStore } from '@/stores/ranking';
import RankingTable from './RankingTable.vue';

withDefaults(
  defineProps<{
    isModal?: boolean;
  }>(),
  {
    isModal: false
  }
);

// ------ Refs ------
const isWeeklyRanking = ref(false);
const showOnlyFavorites = ref(false);

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
const selectedWeek = computed(() => configurationStore.selectedWeek);
const isLoadingSeason = computed(() => configurationStore.isLoading || rankingStore.isLoadingSeason);
const seasonRanking = computed(() => rankingStore.seasonRanking);
const activeProfile = computed(() => activeProfileStore.activeProfile);
const selectedWeekRanking = computed(
  () => rankingStore.weeksRanking?.find((weekRanking) => weekRanking.week === selectedWeek.value)?.ranking || []
);

const filteredSeasonRanking = computed(() => {
  if (!showOnlyFavorites.value || !activeProfile.value?.favorites?.length) return seasonRanking.value;
  return seasonRanking.value.filter(
    (line) => line.user.id === activeProfile.value!.id || activeProfile.value!.favorites!.includes(String(line.user.id))
  );
});

const filteredWeekRanking = computed(() => {
  if (!showOnlyFavorites.value || !activeProfile.value?.favorites?.length) return selectedWeekRanking.value;
  return selectedWeekRanking.value.filter(
    (line) => line.user.id === activeProfile.value!.id || activeProfile.value!.favorites!.includes(String(line.user.id))
  );
});
</script>
<style scoped>
.outer-ranking {
  top: 80px;
  right: 0;

  position: sticky;
  min-width: 310px;
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
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey3);
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
  color: var(--bolao-c-white);
}

.favorites-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0 var(--xxs-spacing);
  cursor: pointer;
  color: var(--bolao-c-grey3);
  font-size: var(--m-font-size);
  transition:
    color 0.2s,
    transform 0.15s;
  margin-left: auto;

  &:hover {
    color: var(--bolao-c-gold);
    transform: scale(1.15);
  }

  &--active {
    color: var(--bolao-c-gold);
  }
}

.error-message {
  width: 100%;
  margin: var(--xl-spacing) 0;
}
</style>
