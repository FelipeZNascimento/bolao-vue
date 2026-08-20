<template>
  <div :class="{ 'outer-ranking--compact': mode === 'compact', 'outer-ranking--full': mode === 'full' }">
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
        :columnConfig="mode === 'full' ? 'complete' : columnsOption"
        :rowSpacingConfig="mode === 'full' ? 'normal' : rowSpacing"
        :activeProfile="activeProfile"
        :error="isWeeklyRanking ? errorSeason : errorWeek"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useRankingStore } from '@/stores/ranking';
import RankingTable from './RankingTable.vue';

defineProps<{
  mode: 'full' | 'compact' | 'modal';
}>();

// ------ Refs ------
const isWeeklyRanking = ref(false);
const showOnlyFavorites = ref(false);

const { isLoading: isConfigLoading, selectedWeek } = storeToRefs(useConfigurationStore());
const rankingStore = useRankingStore();
const {
  columnsOption,
  rowSpacing,
  errorWeek,
  errorSeason,
  isLoadingWeek: isLoadingWeekStore,
  isLoadingSeason: isLoadingSeasonStore,
  seasonRanking,
  weeksRanking
} = storeToRefs(rankingStore);
const { activeProfile } = storeToRefs(useActiveProfileStore());

// ------ Computed Properties  ------
const isLoadingWeek = computed(() => isConfigLoading.value || isLoadingWeekStore.value);
const isLoadingSeason = computed(() => isConfigLoading.value || isLoadingSeasonStore.value);
const selectedWeekRanking = computed(
  () => weeksRanking.value?.find((weekRanking) => weekRanking.week === selectedWeek.value)?.ranking || []
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
<style lang="scss" scoped>
.outer-ranking {
  &--full {
    flex: 1;
    max-width: 100vw;
    overflow-x: auto;
  }
  &--compact {
    top: 80px;
    right: 0;
    position: sticky;
    min-width: 310px;
    max-height: calc(100vh - 80px);
  }
}

.ranking-container {
  max-height: calc(100% - 50px);
  overflow-y: auto;
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
</style>
