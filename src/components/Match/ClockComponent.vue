<template>
  <div
    v-if="fluid"
    style="display: flex; flex-direction: row; gap: var(--s-spacing)"
  >
    <div class="outer-clock-fluid">
      <div class="clock-time">
        <i class="pi pi-calendar-clock"></i>
        <span style="font-weight: bold">
          {{ clockStore.formattedDate(timestamp) }}
        </span>
        <span>{{ clockStore.formattedTime(timestamp) }}</span>
      </div>
    </div>
    <div
      v-if="isMatchStarted"
      class="outer-clock-fluid"
    >
      <RibbonComponent
        v-if="activeProfile"
        :ribbon="ribbon"
      />
      <div style="flex: 1; display: flex; align-items: center">
        <span v-if="isClockStopped">{{ MATCH_STATUS_LABELS[status] }}</span>
        <span v-else> {{ clock }} {{ MATCH_STATUS_LABELS[status] }}</span>
      </div>
    </div>
    <div
      class="outer-clock-fluid"
      style="flex-direction: column"
      v-if="odds.odds || odds.overUnder"
    >
      <div style="font-size: var(--s-font-size)">Odds</div>
      <div style="font-size: var(--s-font-size)">
        <span
          style="text-decoration: underline dotted; cursor: help"
          v-tooltip.top="'Diferença de pontos (Negativo: time da casa favorito; Positivo: visitante favorito)'"
        >
          {{ odds.odds }}
        </span>
        |
        <span
          style="text-decoration: underline dotted; cursor: help"
          v-tooltip.top="'Soma dos pontos'"
        >
          {{ odds.overUnder }}
        </span>
      </div>
    </div>
  </div>
  <div
    v-else
    :class="{
      'outer-clock-line': !isGridMode && !isMobileOnly,
      'outer-clock-grid': isGridMode || isMobileOnly,
      clickable: isClickable
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
      style="display: flex; flex-direction: row; align-items: center; flex: 1"
    >
      <i class="pi pi-plus-circle icon"></i>
      <div class="clock-time">
        <div>
          <span style="font-weight: bold; margin-right: var(--xs-spacing)"
            ><i class="pi pi-calendar-clock"></i> {{ clockStore.formattedDate(timestamp) }}</span
          >
          <span>{{ clockStore.formattedTime(timestamp) }}</span>
        </div>
        <div
          style="font-size: var(--xs-font-size)"
          v-if="odds.odds || odds.overUnder"
        >
          Odds:
          <span
            style="text-decoration: underline dotted; cursor: help"
            v-tooltip.top="'Diferença de pontos (Negativo: time da casa favorito; Positivo: visitante favorito)'"
          >
            {{ odds.odds }}
          </span>
          |
          <span
            style="text-decoration: underline dotted; cursor: help"
            v-tooltip.top="'Soma dos pontos'"
          >
            {{ odds.overUnder }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';
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
  isClickable?: boolean;
  ribbon?: Ribbon;
  status: TMatchStatus;
  timestamp: number;
  fluid?: boolean;
  odds: { overUnder: string; odds: string };
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
.clickable {
  cursor: pointer;
}

.outer-clock-line {
  background-color: var(--bolao-c-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--m-font-size);
  position: relative;
  color: var(--bolao-c-grey1);

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

  &:hover .icon {
    color: var(--bolao-c-gold);
    transform: scale(1.2);
  }
}

.outer-clock-fluid {
  background-color: var(--bolao-c-navy-l1);
  color: var(--bolao-c-grey1);
  display: flex;
  align-items: center;
  position: relative;
  padding: var(--s-spacing);
  min-height: 40px;

  @media (max-width: 1023px) {
    min-width: 80px;
    font-size: var(--s-font-size);
  }

  @media (min-width: 1024px) {
    min-width: 120px;
    font-size: var(--m-font-size);
  }
}

.outer-clock-grid {
  background-color: var(--bolao-c-navy-l1);
  color: var(--bolao-c-grey1);
  min-height: 40px;
  min-width: 120px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 var(--xs-spacing);
  font-size: var(--m-font-size);

  &:hover .icon {
    color: var(--bolao-c-gold);
    transform: scale(1.2);
  }
}

.icon {
  font-size: 22px;
  margin: 0 var(--s-spacing);
  transition: all 0.2s;
  flex: 0;
}

.clock-time {
  font-size: var(--s-font-size);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  flex: 1;

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }
}
</style>
