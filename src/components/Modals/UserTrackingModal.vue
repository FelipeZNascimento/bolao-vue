<template>
  <PrimeDialog
    dismissableMask
    modal
    :breakpoints="{ '1024': '75vw', '575px': '95vw' }"
    v-model:visible="isVisible"
    :draggable="false"
    position="top"
    contentClass="content-class"
    style="width: 60%; padding: var(--s-spacing)"
  >
    <template #header>
      <div class="modal-header">
        <IconAndName
          v-if="selectedUser"
          :color="selectedUser.color"
          :name="selectedUser.name"
          :icon="selectedUser.icon"
          :isActive="isUserActive"
          :isFavorite="isFavorite"
        />
        <button
          v-if="selectedUser && !isUserActive"
          class="favorite-btn"
          :class="{ 'favorite-btn--active': isFavorite }"
          :disabled="isFavoriteUpdating"
          @click="handleFavoriteClick"
          v-tooltip.top="isFavorite ? 'Remover favorito' : 'Adicionar favorito'"
        >
          <i
            class="pi"
            :class="isFavoriteUpdating ? 'pi-spin pi-spinner' : isFavorite ? 'pi-star-fill' : 'pi-star'"
          />
        </button>
      </div>
    </template>
    <PrimeChart
      type="bar"
      :data="chartData()"
      :style="{ height: '300px' }"
      :options="chartOptions"
    ></PrimeChart>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import IconAndName from '@/components/IconAndName.vue';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';
import type { IUser } from '@/stores/activeProfile.types';
import { useRankingStore } from '@/stores/ranking';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
  isUserActive: boolean;
  selectedUser: IUser | null;
}>();

// ------ Refs ------
const isVisible = ref(false);

// ------ Initialization ------
const userService = new UserService();
const activeProfileStore = useActiveProfileStore();
const { isFavoriteUpdating, activeProfile } = storeToRefs(activeProfileStore);
const { weeksRanking: ranking } = storeToRefs(useRankingStore());

// ------ Computed ------
const isFavorite = computed(() => activeProfile.value?.favorites?.includes(String(props.selectedUser?.id)) ?? false);

// ------ Functions ------
function handleFavoriteClick() {
  if (props.selectedUser) {
    userService.updateFavorites(props.selectedUser.id);
  }
}

// ------ Functions  ------
function chartData() {
  const userWeeklyRankings = ranking.value.map((week) => {
    const userLine = week.ranking.find((rankingLine) => rankingLine.user.id === props.selectedUser?.id);

    if (!userLine) return { bullseye: 0, percentage: 0 };
    const bullseye = userLine.score.bullseye * (parseInt(userLine.score.percentage) / userLine.score.winner);
    const winner = parseFloat(userLine.score.percentage) - bullseye;

    return {
      accumulatedBullseye: userLine.score.accumulatedBullseye,
      accumulatedPoints: userLine.score.accumulatedPoints,
      accumulatedPosition: userLine.score.accumulatedPosition,
      bullseye: bullseye.toFixed(1),
      position: userLine.user.position,
      winner: winner.toFixed(1)
    };
  });

  return {
    datasets: [
      {
        backgroundColor: '#f4b303',
        borderColor: '#f4b303',
        borderWidth: 2,
        data: userWeeklyRankings.map((week) => week.position),
        label: 'Posição',
        tension: 0.4,
        type: 'line',
        yAxisID: 'y1'
      },
      {
        backgroundColor: '#de6135',
        borderColor: '#de6135',
        borderWidth: 2,
        data: userWeeklyRankings.map((week) => week.accumulatedPosition),
        label: 'Posição Geral',
        tension: 0.4,
        type: 'line',
        yAxisID: 'y1'
      },
      {
        backgroundColor: '#29c84e50',
        data: userWeeklyRankings.map((week) => week.bullseye),
        label: '% Pontos na Mosca',
        type: 'bar',
        yAxisID: 'y'
      },
      {
        backgroundColor: '#03a9f450',
        data: userWeeklyRankings.map((week) => week.winner),
        label: '% Pontos Vencedores',
        type: 'bar',
        yAxisID: 'y'
      }
    ],
    labels: ranking.value.map((week) => `Semana ${week.week}`)
  };
}

const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: { stacked: true, ticks: { color: 'white' }, grid: { color: '#ffffff20' } },
    y: {
      position: 'left',
      stacked: true,
      grid: { color: '#ffffff20' },
      ticks: {
        color: 'white'
      },
      title: {
        display: true,
        text: 'Porcentagem de Pontos',
        color: 'white'
      }
    },
    y1: {
      display: true,
      grid: {
        display: false,
        color: 'white',
        drawOnChartArea: false
      },
      max: 35,
      min: 1,
      position: 'right',
      reverse: true,
      stacked: false,
      ticks: {
        min: 1,
        stepSize: 1,
        color: 'white'
      },
      title: {
        display: true,
        text: 'Posição',
        color: 'white'
      },
      type: 'linear'
    }
  }
};
// ------ Watches ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  }
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style>
.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
}
</style>
<style lang="scss" scoped>
.modal-header {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0 var(--xxs-spacing);
  cursor: pointer;
  color: var(--bolao-c-grey3);
  font-size: var(--m-font-size);
  transition:
    color 0.2s,
    transform 0.15s;

  &:hover:not(:disabled) {
    color: var(--bolao-c-gold);
    transform: scale(1.2);
  }

  &--active {
    color: var(--bolao-c-gold);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
}
</style>
