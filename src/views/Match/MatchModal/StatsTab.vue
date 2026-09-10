<template>
  <div
    v-if="isLoading"
    class="tab-loading"
  >
    <PrimeProgressSpinner />
  </div>
  <div
    v-else-if="error"
    class="tab-error"
  >
    {{ error }}
  </div>
  <div
    v-else-if="summary"
    class="stats-outer"
  >
    <!-- header row -->
    <div class="stat-row stat-row--header">
      <span class="stat-col stat-col--away">{{ awayAlias }}</span>
      <span class="stat-col stat-col--label" />
      <span class="stat-col stat-col--home">{{ homeAlias }}</span>
    </div>
    <!-- one row per stat -->
    <div
      v-for="(awayStat, i) in summary.away.statistics"
      :key="awayStat.name"
      class="stat-row"
    >
      <span class="stat-col stat-col--away">{{ awayStat.displayValue }}</span>
      <span class="stat-col stat-col--label">{{ awayStat.label }}</span>
      <span class="stat-col stat-col--home">{{ summary.home.statistics[i]?.displayValue }}</span>
    </div>
  </div>
  <div
    v-else
    class="tab-empty"
  >
    Sem estatísticas disponíveis.
  </div>
</template>
<script setup lang="ts">
import type { IMatchSummary } from '@/stores/matchSummary.type';

defineProps<{
  awayAlias: string;
  error: string | null;
  homeAlias: string;
  isLoading: boolean;
  summary: IMatchSummary | null;
}>();
</script>
<style lang="scss" scoped>
.tab-loading {
  display: flex;
  justify-content: center;
  padding: var(--xl-spacing);
}

.tab-error,
.tab-empty {
  padding: var(--l-spacing);
  color: var(--bolao-c-grey3);
  text-align: center;
}

.stats-outer {
  display: flex;
  flex-direction: column;
  padding: var(--m-spacing) var(--l-spacing);
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  border-bottom: 1px solid var(--bolao-c-grey5);
  padding: var(--xs-spacing) 0;
  gap: var(--xs-spacing);

  &--header {
    border-bottom: 2px solid var(--bolao-c-grey4);
    margin-bottom: var(--xs-spacing);
    padding-bottom: var(--s-spacing);
  }

  @media (max-width: 1023px) {
    font-size: var(--xs-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--s-font-size);
  }
}

.stat-col {
  &--away {
    text-align: left;
    font-weight: 600;
  }

  &--label {
    text-align: center;
    color: var(--bolao-c-grey3);
    white-space: nowrap;
    padding: 0 var(--xs-spacing);
  }

  &--home {
    text-align: right;
    font-weight: 600;
  }

  .stat-row--header & {
    font-weight: 700;
    color: inherit;
    font-size: var(--s-font-size);
  }
}
</style>
