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
      <MatchComponent v-else v-for="match in matches" :match="match" :key="match.id" />
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
import { computed } from 'vue';

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
</script>
<style scoped>
.outer-results {
  display: flex;
  flex: row;
  gap: var(--l-spacing);
  position: relative;
}

.outer-matches {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 800px;
}

.error-message {
  width: 100%;
  margin: var(--xl-spacing) 0;
}

.skeleton-match {
  width: 800px !important;
  height: 60px !important;
  margin: var(--xl-spacing) 0;
}
</style>
