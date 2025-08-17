<template>
  <PaginatorComponent />
  <div class="outer-matches">
    <MatchComponent v-for="match in matches" :match="match" :key="match.id" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import PaginatorComponent from '@/components/PaginatorComponent.vue';
import MatchComponent from '@/components/Match/MatchComponent.vue';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

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
<style lang="scss" scoped>
.outer-matches {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
