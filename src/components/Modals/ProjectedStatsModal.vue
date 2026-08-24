<template>
  <PrimeDialog
    :visible="isOpen"
    modal
    dismissableMask
    :draggable="false"
    :style="{ width: '90vw', maxWidth: '420px' }"
    @update:visible="(v: boolean) => !v && handleCloseModal()"
  >
    <template #header>
      <div class="modal-header">
        <span class="modal-player-name">{{ player?.proPlayer.nameFull }}</span>
        <span
          v-if="player?.viewingProjectedPoints"
          class="modal-pts"
        >
          {{ player.viewingProjectedPoints.formatted }} pts proj.
        </span>
      </div>
    </template>

    <template v-if="player?.viewingProjectedStats?.length">
      <div class="stats-grid">
        <div
          v-for="stat in player.viewingProjectedStats"
          :key="stat.category.abbreviation"
          class="stat-item"
        >
          <span
            class="stat-value"
            :title="stat.category.namePlural"
          >
            {{ stat.value.formatted }}
          </span>
          <span class="stat-label">{{ stat.category.abbreviation }}</span>
        </div>
      </div>
    </template>
    <p
      v-else
      class="no-stats"
    >
      Nenhuma estatística projetada disponível.
    </p>
  </PrimeDialog>
</template>
<script setup lang="ts">
import type { IFleaflickerLeaguePlayer } from '@/stores/fleaflicker.types';

defineProps<{
  isOpen: boolean;
  player: IFleaflickerLeaguePlayer | null;
  handleCloseModal: () => void;
}>();
</script>
<style scoped>
.modal-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.modal-player-name {
  font-weight: bold;
  font-size: var(--m-font-size);
}

.modal-pts {
  font-size: var(--s-font-size);
  color: var(--bolao-c-mint);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--s-spacing);
  padding: var(--xs-spacing) 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--s-spacing);
  border-radius: var(--border-radius);
  background-color: light-dark(var(--bolao-c-black-t3), var(--bolao-c-grey4-t1));
}

.stat-value {
  font-size: var(--m-font-size);
  font-weight: bold;
  color: var(--bolao-c-grey1);
}

.stat-label {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
}

.no-stats {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey3);
  text-align: center;
  padding: var(--l-spacing) 0;
}
</style>
