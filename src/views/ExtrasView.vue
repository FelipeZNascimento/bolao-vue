<template>
  <PrimeSkeleton
    class="skeleton-outer"
    v-if="isLoadingConfig"
  />
  <ExtrasBefore v-else-if="!isSeasonStarted" />
  <ExtrasAfter v-else />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';
import ExtrasAfter from './Extras/ExtrasAfter.vue';
import ExtrasBefore from './Extras/ExtrasBefore.vue';

// ------ Initialization ------
const { isSeasonStarted } = storeToRefs(useClockStore());
const { isLoading: isLoadingConfig } = storeToRefs(useConfigurationStore());
</script>
<style lang="scss" scoped>
.skeleton-outer {
  margin-top: var(--l-spacing);

  width: 100% !important;
  height: 500px !important;
}
</style>
