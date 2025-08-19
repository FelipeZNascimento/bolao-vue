<template>
  <div class="outer-team" :style="{ backgroundColor: team.background, color: team.foreground }">
    <span class="team-shield"><img :src="`/team_logos/${props.team.id}.gif`" /></span>
    <span class="team-alias">{{ isGridMode ? team.code : team.alias }}</span>
    <span class="team-score">{{ team.score }}</span>
  </div>
</template>
<script lang="ts" setup>
import type { Team } from '@/stores/matches';

const props = defineProps<{
  team: Team;
  isGridMode: boolean;
  isHomeTeam?: boolean;
}>();
</script>
<style scoped>
.outer-team {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  background-image: url('/match_layer.png');
  position: relative;
  overflow: hidden;
}

.team-shield {
  position: absolute;
  top: -50%;
  left: 20px;
  height: 60px;
  img {
    height: 120px;
    z-index: -1;
  }
}

.team-alias {
  font-size: var(--l-font-size);
  padding-right: var(--s-spacing);
  font-weight: bold;
}

.team-score {
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--l-font-size);
  background-color: #0003;
}
</style>
