<template>
  <div
    class="match-card"
    :class="{
      'match-card--bullseye': ribbon === 'BULLSEYE',
      'match-card--half': ribbon === 'HALF',
      'match-card--miss': ribbon === 'MISS'
    }"
    @click="openModal"
  >
    <!-- live dot / bet indicator -->
    <span
      v-if="isLive"
      class="live-dot"
      v-tooltip.top="'Ao vivo'"
    />
    <i
      v-else
      class="bet-indicator"
      :class="match.loggedUserBets ? 'pi pi-check-square bet-indicator--placed' : 'pi pi-stop bet-indicator--missing'"
      v-tooltip.top="match.loggedUserBets ? 'Aposta feita' : 'Sem aposta'"
    />
    <!-- away -->
    <div
      class="match-team match-team--away"
      :style="{ background: `linear-gradient(to right, ${match.away.background}, transparent)` }"
    >
      <span
        class="team-code"
        :style="{ color: match.away.foreground }"
        >{{ match.away.code }}</span
      >
      <span
        v-if="isStarted"
        class="match-score"
        >{{ match.away.score }}</span
      >
    </div>
    <!-- separator -->
    <span class="match-sep">
      <span
        v-if="isLive"
        class="live-label"
        >{{ statusLabel }}</span
      >
      <span v-else-if="isFinished">Fim</span>
      <span v-else>@</span>
    </span>
    <!-- home -->
    <div
      class="match-team match-team--home"
      :style="{ background: `linear-gradient(to left, ${match.home.background}, transparent)` }"
    >
      <span
        v-if="isStarted"
        class="match-score"
        >{{ match.home.score }}</span
      >
      <span
        class="team-code"
        :style="{ color: match.home.foreground }"
        >{{ match.home.code }}</span
      >
    </div>
  </div>

  <BetsModal
    :match="match"
    :correctBets="correctBets"
    :isOpen="isModalOpen"
    :ribbon="ribbon"
    :handleCloseModal="closeModal"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BetsModal from '@/components/Match/BetsModal/BetsModal.vue';
import { FINISHED_GAME, MATCH_STATUS, MATCH_STATUS_LABELS } from '@/constants/match_status';
import type { IMatch } from '@/stores/matches.types';
import { calculateCorrectBets, calculateRibbon } from '@/util/betsCalculator';

const props = defineProps<{
  match: IMatch;
}>();

const isStarted = computed(() => props.match.status !== MATCH_STATUS.NOT_STARTED);
const isLive = computed(
  () => isStarted.value && !FINISHED_GAME.includes(props.match.status as (typeof FINISHED_GAME)[number])
);
const isFinished = computed(() => FINISHED_GAME.includes(props.match.status as (typeof FINISHED_GAME)[number]));
const statusLabel = computed(() => MATCH_STATUS_LABELS[props.match.status as keyof typeof MATCH_STATUS_LABELS] ?? '');

// ── BetsModal ──
const isModalOpen = ref(false);

const correctBets = computed(() => calculateCorrectBets(props.match.away.score, props.match.home.score));

const ribbon = computed(() => calculateRibbon(correctBets.value, props.match.loggedUserBets?.value, isStarted.value));

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<style lang="scss" scoped>
.match-card {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  padding-left: var(--m-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 4px 16px var(--bolao-c-grey4-t2);
  }

  &--bullseye {
    border-color: var(--bolao-c-gold);
  }

  &--half {
    border-color: var(--bolao-c-blue);
  }

  &--miss {
    border-color: var(--bolao-c-red);
  }
}

.live-dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--bolao-c-red);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.7);
  }
}

.bet-indicator {
  font-size: var(--s-font-size);
  flex-shrink: 0;

  &--placed {
    color: var(--bolao-c-mint);
  }

  &--missing {
    color: var(--bolao-c-grey3);
  }
}

.match-team {
  display: flex;
  align-items: center;
  gap: var(--xs-spacing);
  padding: var(--s-spacing) var(--xs-spacing);
  flex: 1;

  &--away {
    flex-direction: row;
  }

  &--home {
    flex-direction: row-reverse;
  }
}

.team-code {
  font-size: var(--s-font-size);
  font-weight: 800;
  padding: 2px 4px;
  line-height: 1.4;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.match-score {
  font-size: var(--m-font-size);
  font-weight: 700;
  color: var(--color-heading);
  min-width: 20px;
  text-align: center;
}

.match-sep {
  flex: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
}

.live-label {
  color: var(--bolao-c-mint);
  font-weight: 700;
  font-size: var(--xs-font-size);
}
</style>
