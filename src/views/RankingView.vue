<template>
  <PaginatorComponent />

  <div class="outer-ranking-view">
    <RankingComponent mode="full" />
  </div>
</template>
<script setup lang="ts">
import PaginatorComponent from '@/components/PaginatorComponent.vue';
import RankingComponent from '@/components/Ranking/RankingComponent.vue';
</script>
<style scoped>
.outer-ranking-view {
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 1023px) {
    padding: var(--s-spacing);
  }
  @media (min-width: 1024px) {
    padding: var(--l-spacing);
  }
}
</style>
