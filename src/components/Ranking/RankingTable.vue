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
              class="clickable"
              :isShort="columnConfig === 'complete'"
              :color="slotProps.data.user.color"
              :name="slotProps.data.user.name"
              :icon="slotProps.data.user.icon"
              :isActive="activeProfile?.id === slotProps.data.user.id"
              :isFavorite="activeProfile?.favorites?.includes(String(slotProps.data.user.id)) ?? false"
              @click="() => openUserTrackingModal(slotProps.data.user)"
            />
            <div class="badge-wrapper">
              <div
                class="badge"
                :class="[
                  slotProps.data.user.isOnline ? 'badgeOnline' : 'badgeOffline',
                  { 'badge--favorite': activeProfile?.favorites?.includes(String(slotProps.data.user.id)) }
                ]"
              ></div>
            </div>
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
import type { IUser } from '@/stores/activeProfile.types';
import type { TColumnsValue, TRowSpacingValue } from '@/stores/configuration.types';
import { useModalsStore } from '@/stores/modals';
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
const { openUserTrackingModal } = useModalsStore();
</script>
<style lang="scss" scoped>
.outer-position {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  overflow: visible;
}

.position-number {
  width: 20px;
  text-align: right;
  flex-shrink: 0;
}

.badge-wrapper {
  position: relative;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.badge {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &Online {
    @extend .badge;
    background-color: var(--bolao-c-mint);

    &::after {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      animation: ripple 2s infinite ease-in-out;
      border: 1px solid var(--bolao-c-mint);
      content: '';
    }

    &.badge--favorite {
      background-color: var(--bolao-c-gold);

      &::after {
        border-color: var(--bolao-c-gold);
      }
    }
  }

  &Offline {
    @extend .badge;
    background-color: transparent;
    opacity: 0.2;

    &.badge--favorite {
      opacity: 1;
      outline: 1.5px solid var(--bolao-c-gold);
      outline-offset: 1px;
    }
  }
}

.clickable {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}

@keyframes badge-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(2.2);
    opacity: 0;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
</style>
