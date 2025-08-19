<template>
  <div class="outer-clock">
    <div
      v-if="activeProfile"
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
    <span v-if="!isMatchStarted">
      <p class="clock-date">{{ clockStore.formattedDate(timestamp) }}</p>
      <p class="clock-time">{{ clockStore.formattedTime(timestamp) }}</p>
    </span>
  </div>
</template>
<script lang="ts" setup>
import type { Ribbon } from '@/constants/bets';
import { MATCH_STATUS, MATCH_STATUS_LABELS, type MatchStatus } from '@/constants/match_status';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import { computed } from 'vue';

const props = defineProps<{
  status: MatchStatus;
  clock: string;
  timestamp: number;
  ribbon: Ribbon;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const activeProfile = computed(() => {
  return activeProfileStore.activeProfile;
});
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.timestamp;
});

const isClockStopped = computed(
  () =>
    props.status === MATCH_STATUS.FINAL ||
    props.status === MATCH_STATUS.FINAL_OVERTIME ||
    props.status === MATCH_STATUS.CANCELLED ||
    props.status === MATCH_STATUS.END_FIRST ||
    props.status === MATCH_STATUS.END_THIRD ||
    props.status === MATCH_STATUS.HALFTIME ||
    props.status === MATCH_STATUS.DELAYED ||
    props.status === MATCH_STATUS.NOT_STARTED ||
    props.status === MATCH_STATUS.CANCELLED,
);
</script>
<style scoped>
.outer-clock {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  font-size: var(--m-font-size);
  position: relative;
  background-color: var(--color-background-mute);
}

.ribbon {
  font-size: var(--m-font-size);
  font-weight: bold;
  color: #fff;
}
.ribbon {
  --f: 0.2em; /* control the folded part */
  --r: 0.2em; /* control the cutout */

  position: absolute;
  left: 2px;
  top: calc(-1 * var(--f));
  padding: 0.2em;
  border: solid #0000;
  border-width: 0 0 var(--r) calc(2 * var(--f));
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f))
    var(--f) no-repeat border-box;
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
}

.green-bg {
  --c: var(--bolao-c-green);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f))
    var(--f) no-repeat border-box;
  background-color: var(--c);
}
.blue-bg {
  --c: var(--bolao-c-blue);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f))
    var(--f) no-repeat border-box;
  background-color: var(--c);
}
.red-bg {
  --c: var(--bolao-c-red);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f))
    var(--f) no-repeat border-box;
  background-color: var(--c);
}

.grey-bg {
  --c: var(--bolao-c-grey4);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f))
    var(--f) no-repeat border-box;
  background-color: var(--c);
}
</style>
