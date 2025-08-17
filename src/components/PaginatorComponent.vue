<template>
  <div class="outer-paginator">
    <select
      name="weekSelector"
      id="weekSelector"
      class="week-selector"
      @change="handlePageChangeFromDropdown"
    >
      <option
        v-for="week in weeks.filter((week) => !week.hidden)"
        :key="week.num"
        :value="week.num"
        :selected="week.num === selectedWeek"
      >
        {{ week.display }}
      </option>
    </select>
    <PrimePaginator
      class="paginator"
      :first="selectedWeek && selectedWeek - 1"
      :rows="1"
      :totalRecords="weeks.filter((week) => !week.hidden).length"
      @page="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import { WEEKS } from '@/constants/weeks';
import { useConfigurationStore } from '@/stores/configuration';
import type { PageState } from 'primevue';
import { computed, ref } from 'vue';

// ------ Refs ------
const weeks = ref(WEEKS);

// ------ Initialization ------
const configurationStore = useConfigurationStore();

// ------ Computed Properties ------
const selectedWeek = computed(() => configurationStore.selectedWeek);

// ------ Functions ------
function handlePageChange(e: PageState) {
  configurationStore.setSelectedWeek(e.page + 1);
}

function handlePageChangeFromDropdown(e: Event) {
  const el = e.target as HTMLInputElement;
  configurationStore.setSelectedWeek(parseInt(el.value));
}
</script>
<style lang="scss" scoped>
.outer-paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: var(--m-spacing);
}

.week-selector {
  height: 30px;
  width: 140px;
}

.paginator {
  flex: 1;
}
</style>
