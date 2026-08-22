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
        'team-shield-grid--not-started': isGridMode && !isMatchStarted
      }"
    >
      <img
        :class="isScoreless || (isGridMode && !isMatchStarted) ? 'team-shield-image-small' : 'team-shield-image'"
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
      :style="{ fontWeight: isWinning ? 'bold' : 'normal' }"
    >
      {{ team.score }}
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
import { computed } from 'vue';
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
}
</style>
