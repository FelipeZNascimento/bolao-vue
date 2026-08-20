<template>
  <section class="dashboard-section">
    <h2 class="section-title">Semana {{ currentWeek }}</h2>
    <div
      v-if="isLoadingMatches"
      class="match-grid"
    >
      <PrimeSkeleton
        v-for="n in 6"
        :key="n"
        height="72px"
      />
    </div>
    <div
      v-else-if="matches.length"
      class="match-grid"
    >
      <TinyMatchComponent
        v-for="match in matches"
        :key="match.id"
        :match="match"
      />
    </div>
    <p
      v-else
      class="empty-state"
    >
      Nenhum jogo nesta semana.
    </p>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import TinyMatchComponent from './TinyMatchComponent.vue';

const { currentWeekMatches: matches, isLoading: isLoadingMatches } = storeToRefs(useMatchesStore());
const { currentWeek } = storeToRefs(useConfigurationStore());
</script>

<style lang="scss" scoped>
.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.section-title {
  font-size: var(--l-font-size);
  font-weight: 700;
  color: var(--color-heading);
}

.match-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--s-spacing);
}

.empty-state {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  text-align: center;
  padding: var(--xl-spacing) 0;
}
</style>
