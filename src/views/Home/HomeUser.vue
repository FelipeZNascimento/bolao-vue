<template>
  <div class="home">
    <HomeGreeting :myRankingLine="myRankingLine" />
    <HomeExtras v-if="!isSeasonStarted" />
    <HomeMatches />
    <HomeNews />
    <HomeRanking />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import type { IUser } from '@/stores/activeProfile.types';
import { useClockStore } from '@/stores/clock';
import { useRankingStore } from '@/stores/ranking';
import HomeExtras from './HomeExtras.vue';
import HomeGreeting from './HomeGreeting.vue';
import HomeMatches from './HomeMatches.vue';
import HomeNews from './HomeNews.vue';
import HomeRanking from './HomeRanking.vue';

const props = defineProps<{
  activeProfile: IUser;
}>();

const { isSeasonStarted } = storeToRefs(useClockStore());
const rankingStore = useRankingStore();
const myRankingLine = computed(() => rankingStore.seasonRanking.find((l) => l.user.id === props.activeProfile.id));
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--xxl-spacing);
  padding: var(--xxl-spacing) var(--l-spacing);
  max-width: 900px;
  margin: 0 auto;
}
</style>
