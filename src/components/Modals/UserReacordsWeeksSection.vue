<template>
  <div
    v-if="isLoading"
    class="weeks-state"
  >
    <PrimeProgressSpinner
      style="width: 40px; height: 40px"
      strokeWidth="4"
    />
  </div>
  <div
    v-else-if="error"
    class="weeks-state"
  >
    <i class="pi pi-exclamation-triangle" />
    {{ error }}
  </div>
  <div
    v-else-if="records"
    class="weeks-wrapper"
  >
    <div class="weeks-group">
      <h3 class="weeks-title">
        <i class="pi pi-arrow-up" />
        Melhores semanas
      </h3>
      <PrimeDataTable
        :value="records.topWeeks"
        sortField="percentage"
        :sortOrder="-1"
        size="small"
        stripedRows
      >
        <PrimeColumn
          field="seasonLabel"
          header="Temp."
        />
        <PrimeColumn
          field="week"
          header="Semana"
        />
        <PrimeColumn
          field="points"
          header="Pontos"
        />
        <PrimeColumn
          field="bullseye"
          header="Mosca"
        />
        <PrimeColumn
          field="percentage"
          header="%"
        >
          <template #body="{ data }"> {{ data.percentage }}% </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <div class="weeks-group">
      <h3 class="weeks-title">
        <i class="pi pi-arrow-down" />
        Piores semanas
      </h3>
      <PrimeDataTable
        :value="records.bottomWeeks"
        sortField="percentage"
        :sortOrder="1"
        size="small"
      >
        <PrimeColumn
          field="seasonLabel"
          header="Temp."
        />
        <PrimeColumn
          field="week"
          header="Semana"
        />
        <PrimeColumn
          field="points"
          header="Pontos"
        />
        <PrimeColumn
          field="bullseye"
          header="Mosca"
        />
        <PrimeColumn
          field="percentage"
          header="%"
        >
          <template #body="{ data }"> {{ data.percentage }}% </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>
  </div>
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
.weeks-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-spacing);
  padding: var(--xl-spacing);
  color: var(--p-text-muted-color);
}

.weeks-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
  padding: var(--m-spacing) 0;
}

.weeks-group {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
}

.weeks-title {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  font-size: var(--s-font-size);
  font-weight: 700;
  color: var(--p-text-muted-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .pi-arrow-up {
    color: var(--bolao-c-mint);
  }
  .pi-arrow-down {
    color: var(--p-red-400);
  }
}
</style>
