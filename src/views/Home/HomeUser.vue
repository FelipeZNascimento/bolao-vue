<template>
  <div class="home">
    <!-- ── Greeting ── -->
    <section class="greeting">
      <div class="greeting-left">
        <font-awesome-icon
          class="greeting-icon"
          :style="{ color: activeProfile.color }"
          :icon="activeProfile.icon"
        />
        <div>
          <h1 class="greeting-title">Olá, {{ activeProfile.name }}!</h1>
          <p
            v-if="myRankingLine"
            class="greeting-sub"
          >
            Você está em
            <strong>{{ myRankingLine.user.position }}º lugar</strong>
            com
            <strong>{{ myRankingLine.user.totalPoints }} pts</strong>
            na temporada.
          </p>
          <p
            v-else
            class="greeting-sub"
          >
            Bem-vindo ao Bolão NFL!
          </p>
        </div>
      </div>
      <RouterLink to="/jogos">
        <PrimeButton
          label="Apostar agora"
          icon="pi pi-american-football"
        />
      </RouterLink>
    </section>

    <!-- ── This week's matches ── -->
    <section class="dashboard-section">
      <h2 class="section-title">Jogos da semana {{ configurationStore.currentWeek }}</h2>
      <div
        v-if="isLoadingMatches"
        class="match-grid"
      >
        <PrimeSkeleton
          v-for="n in 6"
          :key="n"
          height="72px"
        />
      </div>
      <div
        v-else-if="matches.length"
        class="match-grid"
      >
        <TinyMatchComponent
          v-for="match in matches"
          :key="match.id"
          :match="match"
        />
      </div>
      <p
        v-else
        class="empty-state"
      >
        Nenhum jogo nesta semana.
      </p>
    </section>

    <!-- ── Season ranking snapshot ── -->
    <section class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">Top ranking da temporada</h2>
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
          v-for="n in 5"
          :key="n"
          height="48px"
        />
      </div>
      <ol
        v-else-if="top5.length"
        class="ranking-list"
      >
        <li
          v-for="line in top5"
          :key="line.user.id"
          class="ranking-row"
          :class="{ 'ranking-row--me': line.user.id === activeProfile.id }"
        >
          <span class="rank-pos">{{ line.user.position }}º</span>
          <font-awesome-icon
            class="rank-icon"
            :style="{ color: line.user.color }"
            :icon="line.user.icon"
          />
          <span class="rank-name">{{ line.user.name }}</span>
          <span class="rank-pts">{{ line.user.totalPoints }} pts</span>
          <span class="rank-pct">{{ line.user.totalPercentage }}%</span>
        </li>
      </ol>
      <p
        v-else
        class="empty-state"
      >
        Ranking ainda não disponível.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { IUser } from '@/stores/activeProfile.types';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';
import { useRankingStore } from '@/stores/ranking';
import TinyMatchComponent from '@/views/Home/TinyMatchComponent.vue';

const props = defineProps<{
  activeProfile: IUser;
}>();

const configurationStore = useConfigurationStore();
const matchesStore = useMatchesStore();
const rankingStore = useRankingStore();

const matches = computed(() => matchesStore.currentWeekMatches);
const isLoadingMatches = computed(() => matchesStore.isLoading);
const isLoadingRanking = computed(() => rankingStore.isLoadingSeason);
const top5 = computed(() => rankingStore.seasonRanking.slice(0, 5));
const myRankingLine = computed(() => rankingStore.seasonRanking.find((l) => l.user.id === props.activeProfile.id));
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--xxxl-spacing);
  padding: var(--xxl-spacing) var(--l-spacing);
  max-width: 900px;
  margin: 0 auto;
}

.greeting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--l-spacing);
  padding: var(--xl-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  flex-wrap: wrap;
  a {
    text-decoration: none;
  }
}

.greeting-left {
  display: flex;
  align-items: center;
  gap: var(--l-spacing);
}

.greeting-icon {
  font-size: 48px;
}

.greeting-title {
  font-size: var(--xl-font-size);
  font-weight: 800;
  color: var(--color-heading);
}

.greeting-sub {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  margin-top: var(--xxs-spacing);
}

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
  font-size: var(--xl-font-size);
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--l-spacing);
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

.match-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--s-spacing);
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

.rank-icon {
  font-size: var(--m-font-size);
  flex-shrink: 0;
}
.rank-name {
  flex: 1;
  font-size: var(--s-font-size);
  color: var(--color-heading);
  font-weight: 600;
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
