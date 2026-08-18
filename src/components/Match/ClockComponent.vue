<template>
  <div
    :class="{
      'outer-clock': !isGridMode,
      'outer-clock-grid': isGridMode
    }"
  >
    <RibbonComponent
      v-if="activeProfile && isMatchStarted"
      :ribbon="ribbon"
    />
    <div
      v-if="isMatchStarted"
      style="flex: 1; display: flex; align-items: center"
    >
      <i class="pi pi-plus-circle icon"></i>
      <span v-if="isClockStopped">{{ MATCH_STATUS_LABELS[status] }}</span>
      <span v-else> {{ clock }} {{ MATCH_STATUS_LABELS[status] }}</span>
    </div>
    <div
      v-if="!isMatchStarted"
      class="clock-time"
    >
      <span style="font-weight: bold; margin-right: var(--xs-spacing)">{{ clockStore.formattedDate(timestamp) }}</span>
      {{ clockStore.formattedTime(timestamp) }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { Ribbon } from '@/constants/bets';
import { MATCH_STATUS_LABELS, STOPPED_GAME, type TMatchStatus } from '@/constants/match_status';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import RibbonComponent from './RibbonComponent.vue';

const props = defineProps<{
  clock: string;
  isGridMode?: boolean;
  isMatchStarted: boolean;
  ribbon?: Ribbon;
  status: TMatchStatus;
  timestamp: number;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const activeProfile = computed(() => {
  return activeProfileStore.activeProfile;
});

const isClockStopped = computed(() => STOPPED_GAME.includes(props.status));
</script>
<style lang="scss" scoped>
.left-aligned {
  justify-content: flex-start;
}

.right-aligned {
  justify-content: flex-end;
}

.outer-clock {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--m-font-size);
  position: relative;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  height: 50px;

  @media (max-width: 1023px) {
    width: 80px;
    font-size: var(--s-font-size);
  }

  @media (min-width: 1024px) {
    width: 120px;
    font-size: var(--s-font-size);
  }

  @media (min-width: 1440px) {
    width: 160px;
    font-size: var(--m-font-size);
  }

  .icon {
    font-size: 22px;
    margin: 0 var(--s-spacing);
    transition: all 0.2s;
    flex: 0;
  }

  &:hover .icon {
    color: var(--bolao-c-gold);
    transform: scale(1.2);
  }
}

.outer-clock-grid {
  background-color: var(--bolao-c-navy-t2);
  color: var(--bolao-c-grey1);
  min-height: 40px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 var(--m-spacing);
  font-size: var(--m-font-size);
}

.clock-date {
  font-size: var(--m2-font-size);
}

.clock-time {
  font-size: var(--s-font-size);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex: 1;

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }
}
</style>
