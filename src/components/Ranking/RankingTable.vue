<template>
  <PrimeDataTable :value="rankingData" :size="rowSpacingConfig" :loading="isLoading" stripedRows>
    <PrimeColumn field="position" header="" sortable>
      <template #body="slotProps">
        <div style="display: flex; flex-direction: row">
          <div class="outer-position">
            {{
              slotProps.data.position < 10 ? `0${slotProps.data.position}` : slotProps.data.position
            }}
            <IconAndName
              :isShort="columnConfig === 'complete'"
              :color="slotProps.data.color"
              :name="slotProps.data.name"
              :icon="slotProps.data.icon"
              :isActive="activeProfile?.id === slotProps.data.id"
              :isOnline="slotProps.data.isOnline"
            />
            <div
              class="badge"
              :class="slotProps.data.isOnline ? 'badgeOnline' : 'badgeOffline'"
            ></div>
          </div>
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn field="totalPoints" header="Pts" sortable></PrimeColumn>
    <PrimeColumn field="totalBullseye" sortable>
      <template #header>
        <i v-tooltip.top="'Na mosca'" class="pi pi-bullseye"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="isWeekly && columnConfig === 'complete'" field="totalWinners" sortable>
      <template #header>
        <i v-tooltip.top="'Vencedor correto'" class="pi pi-check"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="columnConfig === 'complete'" field="totalPercentage" sortable>
      <template #header>
        <i v-tooltip.top="'Aproveitamento'" class="pi pi-percentage"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="!isWeekly && columnConfig === 'complete'" field="totalExtras" sortable>
      <template #header> <i v-tooltip.top="'Extras'" class="pi pi-plus"></i> </template>
    </PrimeColumn>
  </PrimeDataTable>
  <PrimeMessage v-if="error" class="error-message" severity="error" variant="outlined">
    Ops, houve um problema de comunicação com o servidor para buscar o ranking.
    <p>
      Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em
      contato com os administradores do Bolão.
    </p>
    <p>{{ error }}</p>
  </PrimeMessage>
</template>
<script setup lang="ts">
import type { RankingUser } from '@/services/ranking';
import type { User } from '@/stores/activeProfile';
import type { ColumnsOption, RowSpacing } from '@/stores/ranking';

import IconAndName from '@/components/IconAndName.vue';

defineProps<{
  activeProfile: null | User;
  columnConfig: ColumnsOption;
  error: Error | null;
  isLoading: boolean;
  isWeekly: boolean;
  rankingData: RankingUser[];
  rowSpacingConfig: RowSpacing;
}>();
</script>
<style lang="scss" scoped>
.outer-position {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
}

.badge {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &Online {
    @extend .badge;
    background-color: var(--bolao-c-mint);
    color: var(--bolao-c-mint);

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: ripple 2s infinite ease-in-out;
      border: 1px solid;
      content: '';
    }
  }

  &Offline {
    @extend .badge;

    background-color: var(--bolao-c-grey3);
    color: var(--bolao-c-red);
    opacity: 0.2;
  }
}
</style>
