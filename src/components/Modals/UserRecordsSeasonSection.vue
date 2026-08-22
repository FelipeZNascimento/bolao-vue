<template>
  <div
    v-if="isLoading"
    class="records-state"
  >
    <PrimeProgressSpinner
      style="width: 40px; height: 40px"
      strokeWidth="4"
    />
  </div>
  <div
    v-else-if="error"
    class="records-state"
  >
    <i class="pi pi-exclamation-triangle" />
    {{ error }}
  </div>
  <template v-else-if="records">
    <!-- Summary totals -->
    <div class="records-totals">
      <div class="total-stat">
        <span class="total-label">Temporadas</span>
        <span class="total-value">{{ records.seasons.length }}</span>
      </div>
      <div class="total-stat">
        <span class="total-label">Apostas</span>
        <span class="total-value">{{ records.totalBets }}</span>
      </div>
      <div class="total-stat">
        <span class="total-label">Na mosca</span>
        <span class="total-value"
          >{{ records.totalBullseyes }} ({{ ((records.totalBullseyes / records.totalBets) * 100).toFixed(1) }}%)</span
        >
      </div>
      <div class="total-stat">
        <span class="total-label">Vencedores</span>
        <span class="total-value"
          >{{ records.totalWins }} ({{ ((records.totalWins / records.totalBets) * 100).toFixed(1) }}%)</span
        >
      </div>
    </div>

    <!-- Per-season table -->
    <PrimeDataTable
      :value="records.seasons"
      sortField="season"
      :sortOrder="-1"
      size="small"
      class="records-table"
      stripedRows
    >
      <PrimeColumn
        field="seasonLabel"
        header="Temporada"
        sortable
      />
      <PrimeColumn
        field="position"
        header="Posição"
        sortable
      >
        <template #body="{ data }"> {{ data.position }}º / {{ data.totalParticipants }} </template>
      </PrimeColumn>
      <PrimeColumn
        field="points"
        header="Pontos"
        sortable
      />
      <PrimeColumn
        field="percentage"
        header="%"
        sortable
      >
        <template #body="{ data }"> {{ data.percentage }}% </template>
      </PrimeColumn>
    </PrimeDataTable>
  </template>
</template>

<script setup lang="ts">
import type { IUserRecords } from './userRecords.types';

defineProps<{
  records: IUserRecords | null;
  isLoading: boolean;
  error: string | null;
}>();
</script>

<style lang="scss" scoped>
.records-totals {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-spacing);
  padding: var(--m-spacing) 0;
  border-bottom: 1px solid var(--p-surface-border);
  margin-bottom: var(--s-spacing);
  justify-content: center;
}

.total-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: var(--bolao-c-grey3-t1);
  padding: var(--s-spacing);
  flex: 1;

  .total-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--bolao-c-grey3);
  }

  .total-value {
    font-size: var(--m-font-size);
    font-weight: 700;
    color: var(--bolao-c-grey2);

    @media (max-width: 1023px) {
      font-size: var(--s-font-size);
    }
  }
}

.records-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-spacing);
  padding: var(--xl-spacing);
  color: var(--p-text-muted-color);
}

.records-table {
  width: 100%;
}
</style>
