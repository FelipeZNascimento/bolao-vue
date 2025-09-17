<template>
  <div
    class="outer-team"
    :class="isNameless ? 'outer-team-nameless' : ''"
    :style="{ backgroundColor: team.background, color: team.foreground }"
  >
    <span
      :class="{
        'team-shield-line': !isGridMode,
        'team-shield-grid': isGridMode,
      }"
      class="team-shield"
    >
      <img
        :class="isScoreless ? 'team-shield-image-small' : 'team-shield-image'"
        :src="`/team_logos/${props.team.id}.gif`"
      />
    </span>
    <div v-if="!isNameless" class="team-alias">
      {{ isGridMode || isAlias ? team.code : team.alias }}
      <p style="padding: 0; margin: 0; font-size: var(--s-font-size); text-align: right">0-1</p>
    </div>
    <span v-if="!isScoreless" class="team-score">{{ team.score }}</span>
  </div>
</template>
<script lang="ts" setup>
import type { ITeam } from '@/stores/matches.types';

const props = defineProps<{
  isAlias?: boolean;
  isGridMode: boolean;
  isHomeTeam?: boolean;
  isNameless?: boolean;
  isScoreless?: boolean;
  team: Partial<ITeam>;
}>();
</script>
<style lang="scss" scoped>
.outer-team {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  max-height: 60px;
  background-image: url('/match_layer.png');
  position: relative;
  overflow: hidden;
}

.outer-team-nameless {
  min-width: 60px;
}

.team-shield-grid {
  position: absolute;
  height: 60px;
  left: 20px;
  top: -50%;

  @media (max-width: 1024px) {
    top: 0%;
  }
}

.team-shield-line {
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translate(0, -50%);

  @media (max-width: 1024px) {
    left: 5%;
    top: 0%;
    transform: none;
  }
}

.team-shield-image {
  height: 100px;
  z-index: -1;

  @media (max-width: 1024px) {
    height: 60px;
  }
}

.team-shield-image-small {
  height: 60px;
  z-index: -1;
}

.team-alias {
  position: relative;
  padding-right: var(--s-spacing);
  font-weight: bold;
  z-index: 99;
  font-size: var(--l-font-size);
  line-height: var(--xl-spacing);

  @media (max-width: 1024px) {
    font-size: var(--s-font-size);
  }

  @media (max-width: 1444px) {
    font-size: var(--m-font-size);
  }
}

.team-score {
  min-width: 55px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--l-font-size);
  background-color: #0003;
  padding: 0 var(--m-spacing);
}
</style>
