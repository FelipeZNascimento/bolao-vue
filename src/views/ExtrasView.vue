<template>
  <PrimeSkeleton class="skeleton-outer" v-if="isLoadingConfig" />
  <ExtrasBefore v-else-if="!isSeasonStarted" />
  <ExtrasAfter v-else />
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';

import ExtraBetService from '@/services/extra_bet';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';

import ExtrasAfter from './Extras/ExtrasAfter.vue';
import ExtrasBefore from './Extras/ExtrasBefore.vue';

// ------ Initialization ------
const extraBetService = new ExtraBetService();
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();

if (!configurationStore.isLoading) {
  extraBetService.fetch();
}

// ------ Computed Properties ------
const isLoadingConfig = computed(() => configurationStore.isLoading);
const isSeasonStarted = computed(
  () =>
    configurationStore.seasonStart && clockStore.currentTimestamp >= configurationStore.seasonStart,
);

// ------ Watches ------
// Fetches extra bets only after configuration store is loaded
watch(isLoadingConfig, async (newValue, oldValue) => {
  if (newValue === false && oldValue !== newValue) {
    extraBetService.fetch();
  }
});
</script>
<style lang="scss" scoped>
.skeleton-outer {
  margin-top: var(--l-spacing);

  width: 100% !important;
  height: 500px !important;
}
</style>
