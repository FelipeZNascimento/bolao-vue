<template>
  <PrimeDataTable
    :value="rankingData"
    :size="rowSpacingConfig"
    :loading="isLoading"
    :rowClass="(row: IRankingLine) => (row.user.id === activeProfile?.id ? 'row--active-user' : '')"
    :rowStyle="
      (row: IRankingLine) => (row.user.id === activeProfile?.id ? { '--active-user-color': activeProfile!.color } : {})
    "
    stripedRows
  >
    <PrimeColumn
      field="user.position"
      header=""
      sortable
    >
      <template #body="{ data }">
        <div style="display: flex; flex-direction: row">
          <div class="outer-position">
            <span
              class="position-number"
              :class="{
                'position-number--1': data.user.position === 1,
                'position-number--2': data.user.position === 2 && !isWeekly,
                'position-number--3': data.user.position === 3 && !isWeekly,
                'position-number--top5': data.user.position > 3 && data.user.position <= 5 && !isWeekly
              }"
            >
              {{ data.user.position < 10 ? `0${data.user.position}` : data.user.position }}
            </span>
            <IconAndName
              :user="data.user"
              :isShort="columnConfig === 'complete'"
              :isActive="activeProfile?.id === data.user.id"
              :isFavorite="activeProfile?.favorites?.includes(String(data.user.id)) ?? false"
              isClickable
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
      v-if="mode === 'full' || (isWeekly && columnConfig === 'complete')"
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
      v-if="mode === 'full' || columnConfig === 'complete'"
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
      v-if="mode === 'full' || (!isWeekly && columnConfig === 'complete')"
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
  columnConfig?: TColumnsValue;
  error: Error | null;
  isLoading: boolean;
  isWeekly: boolean;
  rankingData: IRankingLine[];
  rowSpacingConfig?: TRowSpacingValue;
  mode: 'full' | 'compact' | 'modal';
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

// :deep needed because PrimeVue renders tr outside the scoped component's DOM scope
:deep(.row--active-user td) {
  background-color: color-mix(in srgb, var(--active-user-color) 12%, transparent) !important;
}

:deep(.row--active-user td:first-child) {
  box-shadow: inset 3px 0 0 var(--active-user-color);
}

.position-number {
  width: 20px;
  text-align: right;
  flex-shrink: 0;

  &--1 {
    font-weight: bold;
    color: var(--bolao-c-gold);
  }

  &--2 {
    font-weight: bold;
    color: var(--bolao-c-grey2);
  }

  &--3 {
    font-weight: bold;
    color: var(--bolao-c-orange-d1);
  }

  &--top5 {
    font-weight: bold;
  }
}
</style>
