<template>
  <div class="outer-results">
    <div class="outer-matches">
      <PrimeMessage
        v-show="errorConfiguration"
        class="error-message"
        severity="error"
        variant="outlined"
      >
        Ops, houve um problema de comunicação com o servidor.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir,
          entre em contato com os administradores do Bolão.
        </p>
        <p>{{ errorConfiguration }}</p>
      </PrimeMessage>
      <PaginatorComponent />
      <div v-if="isLoading">
        <PrimeSkeleton v-for="index in 16" :key="index" class="skeleton-match" />
      </div>
      <PrimeMessage
        v-else-if="errorMatches"
        class="error-message"
        severity="error"
        variant="outlined"
      >
        Ops, houve um problema de comunicação com o servidor para buscar as partidas.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir,
          entre em contato com os administradores do Bolão.
        </p>
        <p>{{ errorMatches }}</p>
      </PrimeMessage>
      <div v-else :class="{ 'outer-line-mode': !isGridMode, 'outer-grid-mode': isGridMode }">
        <MatchComponent
          v-for="match in matches"
          :isGridMode="view === 'grid'"
          :match="match"
          :key="match.id"
        />
      </div>
    </div>
    <RankingComponent />
  </div>
</template>
<script setup lang="ts">
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import MatchComponent from '@/components/Match/MatchComponent.vue';
import RankingComponent from '@/components/Ranking/RankingComponent.vue';
import PaginatorComponent from '@/components/PaginatorComponent.vue';
import { computed, ref } from 'vue';

// ------ Refs ------
const isGridMode = ref(true);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const matchesStore = useMatchesStore();

// ------ Computed Properties ------
const isConfigurationLoading = computed(() => configurationStore.isLoading);
const isMatchesLoading = computed(() => matchesStore.isLoading);
const matches = computed(() => matchesStore.matches);
const isLoading = computed(() => isConfigurationLoading.value || isMatchesLoading.value);
const errorConfiguration = computed(() => configurationStore.error);
const errorMatches = computed(() => matchesStore.error);
const view = computed(() => configurationStore.resultsView);
</script>
<style scoped>
.outer-results {
  display: flex;
  flex: row;
  position: relative;
  justify-content: space-between;
}

.outer-matches {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--m-spacing);
}

.outer-line-mode {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--m-spacing);
}

.outer-grid-mode {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: var(--xl-spacing);
}

.error-message {
  width: 100%;
  margin: var(--xl-spacing) 0;
}

.skeleton-match {
  width: 800px !important;
  height: 60px !important;
  margin: var(--s-spacing) 0;
}
</style>
