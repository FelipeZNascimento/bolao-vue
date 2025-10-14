<template>
  <div
    :class="{
      'outer-clock': !isGridMode,
      'outer-clock-grid': isGridMode,
      'right-aligned': isMatchStarted,
      'left-aligned': !isMatchStarted,
    }"
  >
    <div
      v-if="activeProfile && ribbon"
      class="ribbon"
      :class="{
        'green-bg': ribbon === 'BULLSEYE',
        'blue-bg': ribbon === 'HALF',
        'red-bg': ribbon === 'MISS',
        'grey-bg': ribbon === null,
      }"
    >
      <i v-show="ribbon === 'BULLSEYE'" v-tooltip.top="'Na mosca'" class="pi pi-bullseye"></i>
      <i v-show="ribbon === 'HALF'" v-tooltip.top="'Vencedor correto'" class="pi pi-check"></i>
      <i v-show="ribbon === 'MISS'" v-tooltip.top="'Erroooou!'" class="pi pi-times"></i>
      <i v-show="ribbon === null" v-tooltip.top="'Sem apostas'" class="pi pi-times"></i>
    </div>
    <span v-if="isClockStopped">{{ MATCH_STATUS_LABELS[status] }}</span>
    <span v-if="isMatchStarted && !isClockStopped">{{ clock }}</span>
    <span
      v-if="!isMatchStarted"
      :style="isGridMode ? { flexDirection: 'row' } : { flexDirection: 'column' }"
      style="display: flex; align-items: flex-end; flex-wrap: wrap"
      class="clock-time"
    >
      <p style="font-weight: bold">{{ clockStore.formattedDate(timestamp) }}</p>
      <span v-if="isGridMode" style="padding: 0 var(--xs-spacing)"></span>
      <p>{{ clockStore.formattedTime(timestamp) }}</p>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import type { Ribbon } from '@/constants/bets';

import { MATCH_STATUS_LABELS, STOPPED_GAME, type TMatchStatus } from '@/constants/match_status';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';

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
  font-size: var(--m-font-size);
  position: relative;
  background-color: var(--bolao-c-navy-t2);
  color: var(--bolao-c-grey1);
  min-height: 40px;

  span {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 1023px) {
    width: 80px;
    font-size: var(--s-font-size);
    padding: 0 var(--m-spacing);
  }

  @media (min-width: 1024px) {
    width: 120px;
    font-size: var(--s-font-size);
    padding: 0 var(--m-spacing);
  }

  @media (min-width: 1440px) {
    width: 200px;
    font-size: var(--m-font-size);
    padding: 0 var(--xxl-spacing);
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
  font-size: var(--m-font-size);

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }
}

.ribbon {
  --f: 0.2em;
  /* control the folded part */
  --r: 0.2em;
  /* control the cutout */

  font-size: var(--m-font-size);
  font-weight: bold;
  color: #fff;
  position: absolute;
  left: 2px;
  top: calc(-1 * var(--f));
  padding: 0.2em;
  border: solid #0000;
  border-width: 0 0 var(--r) calc(2 * var(--f));
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: #bf4d28;
  border-radius: var(--f) var(--f) 0 0;
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--r)),
    calc(50% + var(--f)) 100%,
    calc(2 * var(--f)) calc(100% - var(--r)),
    calc(2 * var(--f)) var(--f),
    0 var(--f)
  );

  @media (max-width: 1023px) {
    height: 30px;
    left: 0px;
    padding: 0 0.2em;

    i {
      font-size: var(--xs-font-size);
    }
  }
}

.green-bg {
  --c: var(--bolao-c-green);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.blue-bg {
  --c: var(--bolao-c-blue);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.red-bg {
  --c: var(--bolao-c-red);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.grey-bg {
  --c: var(--bolao-c-grey4);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}
</style>
