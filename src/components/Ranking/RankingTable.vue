<template>
  <PrimeDataTable
    :value="rankingData"
    :size="rowSpacingConfig"
    :loading="isLoading"
    stripedRows
  >
    <PrimeColumn
      field="user.position"
      header=""
      sortable
    >
      <template #body="slotProps">
        <div style="display: flex; flex-direction: row">
          <div class="outer-position">
            <span class="position-number">{{
              slotProps.data.user.position < 10 ? `0${slotProps.data.user.position}` : slotProps.data.user.position
            }}</span>
            <IconAndName
              :user="slotProps.data.user"
              :isShort="columnConfig === 'complete'"
              :isActive="activeProfile?.id === slotProps.data.user.id"
              :isFavorite="activeProfile?.favorites?.includes(String(slotProps.data.user.id)) ?? false"
              isClickable
              showBadge
            />
          </div>
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn
      field="score.total"
      header="Pts"
      sortable
    ></PrimeColumn>
    <PrimeColumn
      field="score.bullseye"
      sortable
    >
      <template #header>
        <i
          v-tooltip.top="'Na mosca'"
          class="pi pi-bullseye"
        ></i>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="isWeekly && columnConfig === 'complete'"
      field="score.winner"
      sortable
    >
      <template #header>
        <i
          v-tooltip.top="'Vencedor correto'"
          class="pi pi-check"
        ></i>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="columnConfig === 'complete'"
      field="score.percentage"
      sortable
    >
      <template #header>
        <i
          v-tooltip.top="'Aproveitamento'"
          class="pi pi-percentage"
        ></i>
      </template>
    </PrimeColumn>
    <PrimeColumn
      v-if="!isWeekly && columnConfig === 'complete'"
      field="score.extras"
      sortable
    >
      <template #header>
        <i
          v-tooltip.top="'Extras'"
          class="pi pi-plus"
        ></i>
      </template>
    </PrimeColumn>
  </PrimeDataTable>
  <PrimeMessage
    v-if="error"
    class="error-message"
    severity="error"
    variant="outlined"
  >
    Ops, houve um problema de comunicação com o servidor para buscar o ranking.
    <p>
      Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
      administradores do Bolão.
    </p>
    <p>{{ error?.message }}</p>
  </PrimeMessage>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import IconAndName from '@/components/IconAndName.vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import type { TColumnsValue, TRowSpacingValue } from '@/stores/configuration.types';
import type { IRankingLine } from '@/stores/ranking.types';

defineProps<{
  columnConfig: TColumnsValue;
  error: Error | null;
  isLoading: boolean;
  isWeekly: boolean;
  rankingData: IRankingLine[];
  rowSpacingConfig: TRowSpacingValue;
}>();

const { activeProfile } = storeToRefs(useActiveProfileStore());
</script>
<style lang="scss" scoped>
.outer-position {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  overflow: visible;
  flex: 1;
}

.position-number {
  width: 20px;
  text-align: right;
  flex-shrink: 0;
}
</style>
