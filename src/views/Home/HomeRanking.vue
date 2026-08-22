<template>
  <section class="dashboard-section">
    <div class="section-header">
      <h2 class="section-title">Top 10</h2>
      <RouterLink
        to="/ranking"
        class="section-link"
        >Ver completo →</RouterLink
      >
    </div>
    <div
      v-if="isLoadingRanking"
      class="ranking-list"
    >
      <PrimeSkeleton
        v-for="n in 10"
        :key="n"
        height="48px"
      />
    </div>
    <ol
      v-else-if="topRanking.length"
      class="ranking-list"
    >
      <li
        v-for="line in topRanking"
        :key="line.user.id"
        class="ranking-row"
        :class="{ 'ranking-row--me': line.user.id === activeProfile?.id }"
      >
        <span class="rank-pos">{{ line.user.position }}º</span>
        <IconAndName
          class="rank-name"
          :color="line.user.color"
          :name="line.user.name"
          :icon="line.user.icon"
          :isActive="activeProfile?.id === line.user.id"
          :isFavorite="activeProfile?.favorites?.includes(String(line.user.id)) ?? false"
          @click="() => openUserTrackingModal(line.user)"
        />
        <span class="rank-pts">{{ line.score.total }} pts</span>
        <span class="rank-pct">{{ line.score.percentage }}%</span>
      </li>
    </ol>
    <p
      v-else
      class="empty-state"
    >
      Ranking ainda não disponível.
    </p>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import IconAndName from '@/components/IconAndName.vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useModalsStore } from '@/stores/modals';
import { useRankingStore } from '@/stores/ranking';

const rankingStore = useRankingStore();
const { isLoadingSeason: isLoadingRanking, seasonRanking } = storeToRefs(rankingStore);
const { activeProfile } = storeToRefs(useActiveProfileStore());
const { openUserTrackingModal } = useModalsStore();

const topRanking = computed(() => seasonRanking.value.slice(0, 10));
</script>

<style lang="scss" scoped>
.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--m-spacing);
}

.section-title {
  font-size: var(--l-font-size);
  font-weight: 700;
  color: var(--color-heading);
}

.section-link {
  font-size: var(--s-font-size);
  color: var(--bolao-c-sky);
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  list-style: none;
  padding: 0;
}

.ranking-row {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
  padding: var(--s-spacing) var(--m-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  &--me {
    border-color: var(--bolao-c-sky);
    background: var(--bolao-c-blue-t1);
  }
}

.rank-pos {
  width: 28px;
  font-size: var(--s-font-size);
  font-weight: 700;
  color: var(--bolao-c-grey4);
  text-align: right;
  flex-shrink: 0;
}
.rank-name {
  cursor: pointer;
  flex: 1;
}
.rank-pts {
  font-size: var(--s-font-size);
  font-weight: 700;
  color: var(--color-heading);
}
.rank-pct {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  min-width: 40px;
  text-align: right;
}

.empty-state {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  text-align: center;
  padding: var(--xl-spacing) 0;
}
</style>
