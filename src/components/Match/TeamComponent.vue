<template>
  <div
    class="outer-team"
    :class="{ 'outer-team-nameless': isNameless }"
    :style="{ backgroundColor: team.background, color: team.foreground }"
  >
    <span
      :class="{
        'team-shield-line': !isGridMode,
        'team-shield-grid': isGridMode && isMatchStarted,
        'team-shield-grid--not-started': isGridMode && !isMatchStarted,
        'team-shield--ripple': isRippling
      }"
      :style="{ '--ripple-color': team.background }"
    >
      <img
        :class="[
          isScoreless || (isGridMode && !isMatchStarted) ? 'team-shield-image-small' : 'team-shield-image',
          { 'team-shield-image--impact': isRippling }
        ]"
        :src="`/team_logos/${props.team.id}.gif`"
        :alt="`${props.team.name} Shield`"
      />
    </span>
    <div
      v-if="!isNameless"
      class="team-alias"
    >
      {{ isGridMode || isAlias ? team.code : team.alias }}
      <p
        v-if="props.team.winLosses"
        style="padding: 0; margin: 0; font-size: var(--s-font-size); text-align: right"
      >
        {{ props.team.winLosses }}
      </p>
    </div>
    <div
      v-if="!isScoreless && isMatchStarted"
      class="team-score"
      :class="{ 'team-score--static': !isGlitching, 'team-score--glitch': isGlitching }"
      :style="{
        fontWeight: isWinning ? 'bold' : 'normal',
        '--glitch-primary': team.foreground,
        '--glitch-secondary': team.background
      }"
      :data-score="displayedScore"
    >
      {{ displayedScore }}
      <img
        v-if="team.possession && !isClockStopped"
        src="/src/img/football.png"
        style="position: absolute; top: 5%; left: 5%; height: 15px; width: 15px"
        :alt="`Ball possession for ${team.name}`"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { STOPPED_GAME, type TMatchStatus } from '@/constants/match_status';
import type { ITeam } from '@/stores/matches.types';

const props = defineProps<{
  isAlias?: boolean;
  isGridMode: boolean;
  isHomeTeam?: boolean;
  isNameless?: boolean;
  isScoreless?: boolean;
  isWinning?: boolean;
  isMatchStarted?: boolean;
  matchStatus: TMatchStatus;
  odds?: null | string;
  team: Partial<ITeam>;
}>();

const isClockStopped = computed(() => STOPPED_GAME.includes(props.matchStatus));

const isGlitching = ref(false);
const isRippling = ref(false);
const displayedScore = ref(props.team.score);

watch(
  () => props.team.score,
  (newVal, oldVal) => {
    if (newVal === oldVal || oldVal === undefined) return;
    // Phase 1: keep old score visible, play static flicker
    displayedScore.value = oldVal;
    isGlitching.value = false;
    // Phase 2: swap to new score, fire glitch + shockwave simultaneously
    setTimeout(() => {
      displayedScore.value = newVal;
      isGlitching.value = true;
      isRippling.value = true;
      setTimeout(() => {
        isGlitching.value = false;
        isRippling.value = false;
      }, 700);
    }, 800);
  }
);
</script>
<style lang="scss" scoped>
.outer-team {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  min-height: var(--team-component-height);
  height: var(--team-component-height);
  max-height: var(--team-component-height);
  background-image: url('/match_layer.png');
  position: relative;
  overflow: hidden;
}

.outer-team-nameless {
  min-width: 60px;
}

.team-shield-grid {
  position: absolute;
  height: calc(var(--team-component-height) * 2);
  left: 20px;

  @media (max-width: 1024px) {
    left: 5px;
    height: calc(var(--team-component-height) * 1.2);
  }

  &--not-started {
    position: absolute;
    left: -10px;
    height: calc(var(--team-component-height) * 2);

    @media (max-width: 1024px) {
      height: calc(var(--team-component-height) * 1.2);
    }
  }
}

.team-shield-line {
  position: absolute;
  left: 5%;
  height: calc(var(--team-component-height) * 2);

  @media (max-width: 1024px) {
    height: calc(var(--team-component-height) * 1.2);
  }
}

.team-shield--ripple {
  // First ring via ::before
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 4px solid var(--ripple-color, #fff);
    opacity: 1;
    animation: shield-ripple 1s cubic-bezier(0.2, 0.6, 0.4, 1) forwards;
    pointer-events: none;
    z-index: 10;
  }

  // Second ring via ::after — delayed, slightly larger start
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid var(--ripple-color, #fff);
    opacity: 0.7;
    animation: shield-ripple 1s cubic-bezier(0.2, 0.6, 0.4, 1) 0.18s forwards;
    pointer-events: none;
    z-index: 10;
  }
}

@keyframes shield-ripple {
  0% {
    transform: scale(0.4);
    opacity: 1;
  }
  60% {
    opacity: 0.5;
  }
  100% {
    transform: scale(5);
    opacity: 0;
  }
}

.team-shield-image--impact {
  animation: shield-impact 0.9s ease-out forwards;
}

@keyframes shield-impact {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  15% {
    transform: scale(1.18);
    filter: brightness(1.6) saturate(1.4);
  }
  35% {
    transform: scale(1.08);
    filter: brightness(1.2);
  }
  55% {
    transform: scale(1.13);
    filter: brightness(1.4) saturate(1.2);
  }
  75% {
    transform: scale(1.04);
    filter: brightness(1.1);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

.team-shield-image {
  height: calc(var(--team-component-height) * 2);
  z-index: -1;
  transition: all 0.2s;

  @media (max-width: 1024px) {
    height: calc(var(--team-component-height) * 1.2);
  }
}

.team-shield-image-small {
  height: calc(var(--team-component-height) * 2);
  z-index: -1;

  @media (max-width: 1024px) {
    height: calc(var(--team-component-height) * 1.2);
  }
}

.team-alias {
  position: relative;
  padding-right: var(--s-spacing);
  font-weight: bold;
  z-index: 99;
  font-size: var(--m-font-size);
  line-height: var(--xl-spacing);

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }

  @media (max-width: 1444px) {
    font-size: var(--m-font-size);
  }
}

.team-odds {
  width: 55px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--s-font-size);
  background-color: #0003;
  padding: 0 var(--s-spacing);
}

.team-score {
  min-width: 55px;
  height: var(--team-component-height);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--l-font-size);
  background-color: #0003;
  padding: 0 var(--m-spacing);
  position: relative;

  &--static {
    animation: score-static 0.8s ease-in forwards;
  }

  &--glitch {
    animation: glitch 0.7s steps(1) forwards;

    &::before,
    &::after {
      content: attr(data-score);
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--l-font-size);
      font-weight: inherit;
      background-color: #0003;
    }

    &::before {
      color: var(--glitch-primary);
      animation: glitch-primary 0.7s steps(1) forwards;
    }

    &::after {
      color: var(--glitch-secondary);
      animation: glitch-secondary 0.7s steps(1) forwards;
    }
  }
}

@keyframes score-static {
  0% {
    opacity: 1;
    filter: none;
  }
  20% {
    opacity: 0.9;
    filter: blur(0.3px) brightness(1.1);
  }
  35% {
    opacity: 1;
    filter: none;
  }
  50% {
    opacity: 0.85;
    filter: blur(0.5px) brightness(0.9);
  }
  65% {
    opacity: 1;
    filter: none;
  }
  80% {
    opacity: 0.8;
    filter: blur(0.8px) brightness(1.2);
  }
  100% {
    opacity: 1;
    filter: none;
  }
}

@keyframes glitch {
  0% {
    clip-path: inset(0 0 85% 0);
  }
  10% {
    clip-path: inset(60% 0 10% 0);
  }
  20% {
    clip-path: inset(30% 0 50% 0);
  }
  30% {
    clip-path: inset(80% 0 5% 0);
  }
  40% {
    clip-path: inset(10% 0 70% 0);
  }
  50% {
    clip-path: inset(50% 0 25% 0);
  }
  60% {
    clip-path: inset(20% 0 60% 0);
  }
  70% {
    clip-path: inset(70% 0 15% 0);
  }
  80% {
    clip-path: inset(40% 0 40% 0);
  }
  90% {
    clip-path: inset(5% 0 80% 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes glitch-primary {
  0% {
    transform: translate(-3px, 2px);
    clip-path: inset(10% 0 75% 0);
  }
  15% {
    transform: translate(3px, -1px);
    clip-path: inset(55% 0 20% 0);
  }
  30% {
    transform: translate(-2px, 3px);
    clip-path: inset(25% 0 55% 0);
  }
  45% {
    transform: translate(4px, -2px);
    clip-path: inset(75% 0 10% 0);
  }
  60% {
    transform: translate(-3px, 1px);
    clip-path: inset(40% 0 35% 0);
  }
  75% {
    transform: translate(2px, -3px);
    clip-path: inset(15% 0 65% 0);
  }
  90% {
    transform: translate(-1px, 2px);
    clip-path: inset(60% 0 20% 0);
  }
  100% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
    opacity: 0;
  }
}

@keyframes glitch-secondary {
  0% {
    transform: translate(3px, -2px);
    clip-path: inset(70% 0 15% 0);
  }
  15% {
    transform: translate(-4px, 1px);
    clip-path: inset(20% 0 60% 0);
  }
  30% {
    transform: translate(2px, -3px);
    clip-path: inset(50% 0 30% 0);
  }
  45% {
    transform: translate(-3px, 2px);
    clip-path: inset(10% 0 80% 0);
  }
  60% {
    transform: translate(4px, -1px);
    clip-path: inset(35% 0 45% 0);
  }
  75% {
    transform: translate(-2px, 3px);
    clip-path: inset(65% 0 15% 0);
  }
  90% {
    transform: translate(3px, -2px);
    clip-path: inset(30% 0 50% 0);
  }
  100% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
    opacity: 0;
  }
}
</style>
