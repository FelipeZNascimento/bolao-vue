<template>
  <div class="outer-score">
    <TeamComponent :team="away" />
    <TeamComponent :team="home" />
  </div>
</template>
<script lang="ts" setup>
import type { Team } from '@/stores/matches';
import TeamComponent from './TeamComponent.vue';
const props = defineProps<{
  home: Team;
  away: Team;
}>();
</script>
<style scoped>
.outer-score {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
