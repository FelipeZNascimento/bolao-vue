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
    <div
      v-for="(teamStats, side) in { away: summary.away, home: summary.home }"
      :key="side"
      class="stats-team"
    >
      <p class="stats-team-label">{{ side === 'away' ? awayAlias : homeAlias }}</p>
      <div
        v-for="stat in teamStats.statistics"
        :key="stat.name"
        class="stat-row"
        :class="{ 'stat-row--home': side === 'home' }"
      >
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.displayValue }}</span>
      </div>
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
  gap: var(--l-spacing);
  padding: var(--l-spacing);
}

.stats-team {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
}

.stats-team-label {
  font-weight: 700;
  font-size: var(--m-font-size);
  margin-bottom: var(--xs-spacing);
}

.stat-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid var(--bolao-c-grey5);
  padding: var(--xs-spacing) 0;

  &--home {
    flex-direction: row-reverse;
  }

  @media (max-width: 1023px) {
    font-size: var(--xs-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--s-font-size);
  }
}

.stat-label {
  color: var(--bolao-c-grey3);
}

.stat-value {
  font-weight: 600;
}
</style>
