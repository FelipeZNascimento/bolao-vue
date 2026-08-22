<template>
  <div
    class="match-card"
    :class="{
      'match-card--bullseye': ribbon === 'BULLSEYE',
      'match-card--half': ribbon === 'HALF',
      'match-card--miss': ribbon === 'MISS'
    }"
    @click="openBetsModal(match)"
  >
    <!-- live dot / bet indicator -->
    <span
      v-if="isLive"
      class="live-dot"
      v-tooltip.top="'Ao vivo'"
    />
    <i
      v-else-if="!isStarted"
      class="bet-indicator"
      :class="match.loggedUserBets ? 'pi pi-check-square bet-indicator--placed' : 'pi pi-stop bet-indicator--missing'"
      v-tooltip.top="match.loggedUserBets ? 'Aposta feita' : 'Sem aposta'"
    />
    <!-- away -->
    <div
      class="match-team match-team--away"
      :style="{
        background: `${match.away.background}`
      }"
    >
      <img
        class="team-logo"
        :src="`/team_logos/${match.away.id}.gif`"
        :alt="match.away.code"
      />
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
    <!-- home -->
    <div
      class="match-team match-team--home"
      :style="{
        background: `${match.home.background}`
      }"
    >
      <img
        class="team-logo"
        :src="`/team_logos/${match.home.id}.gif`"
        :alt="match.home.code"
      />
      <span
        class="team-code"
        :style="{ color: match.home.foreground, textAlign: 'right' }"
        >{{ match.home.code }}</span
      >
      <span
        v-if="isStarted"
        class="match-score"
        >{{ match.home.score }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FINISHED_GAME, MATCH_STATUS } from '@/constants/match_status';
import { useMatchesStore } from '@/stores/matches';
import type { IMatch } from '@/stores/matches.types';
import { calculateCorrectBets, calculateRibbon } from '@/util/betsCalculator';

const props = defineProps<{
  match: IMatch;
}>();

const isStarted = computed(() => props.match.status !== MATCH_STATUS.NOT_STARTED);
const isLive = computed(
  () => isStarted.value && !FINISHED_GAME.includes(props.match.status as (typeof FINISHED_GAME)[number])
);
const correctBets = computed(() => calculateCorrectBets(props.match.away.score, props.match.home.score));
const ribbon = computed(() => calculateRibbon(correctBets.value, props.match.loggedUserBets?.value, isStarted.value));

const { openBetsModal } = useMatchesStore();
</script>

<style lang="scss" scoped>
.match-card {
  display: flex;
  align-items: center;
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
  margin: 0 var(--s-spacing);
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
  margin: 0 var(--s-spacing);

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

.team-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

.team-code {
  flex: 1;
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
  flex: 0;
}
</style>
