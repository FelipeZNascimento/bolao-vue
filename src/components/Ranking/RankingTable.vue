<template>
  <PrimeDataTable :value="rankingData" :size="rowSpacingConfig" :loading="isLoading" stripedRows>
    <PrimeColumn field="position" header="" sortable>
      <template #body="slotProps">
        <div class="outer-position">
          {{
            slotProps.data.position < 10 ? `0${slotProps.data.position}` : slotProps.data.position
          }}
          <IconAndName
            :isShort="columnConfig === 'COMPLETE'"
            :color="slotProps.data.color"
            :name="slotProps.data.name"
            :icon="slotProps.data.icon"
            :isActive="activeProfile?.id === slotProps.data.id"
          />
        </div>
      </template>
    </PrimeColumn>
    <PrimeColumn field="totalPoints" header="Pts" sortable></PrimeColumn>
    <PrimeColumn field="totalBullseye" sortable>
      <template #header>
        <i v-tooltip.top="'Na mosca'" class="pi pi-bullseye"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="isWeekly && columnConfig === 'COMPLETE'" field="totalWinners" sortable>
      <template #header>
        <i v-tooltip.top="'Vencedor correto'" class="pi pi-check"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="columnConfig === 'COMPLETE'" field="totalPercentage" sortable>
      <template #header>
        <i v-tooltip.top="'Aproveitamento'" class="pi pi-percentage"></i>
      </template>
    </PrimeColumn>
    <PrimeColumn v-if="!isWeekly && columnConfig === 'COMPLETE'" field="totalExtras" sortable>
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
import IconAndName from '@/components/IconAndName.vue';
import type { RankingUser } from '@/services/ranking';
import type { User } from '@/stores/activeProfile';
import type { ColumnsOption, RowSpacing } from '@/stores/ranking';

defineProps<{
  isWeekly: boolean;
  isLoading: boolean;
  rankingData: RankingUser[];
  columnConfig: ColumnsOption;
  rowSpacingConfig: RowSpacing;
  activeProfile: User | null;
  error: Error | null;
}>();
</script>
<style lang="scss" scoped>
.outer-position {
  display: flex;
  gap: var(--s-spacing);
}
</style>
