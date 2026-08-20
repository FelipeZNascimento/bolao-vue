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
            <strong>{{ myRankingLine.score.total }} pts</strong>
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
      <div style="display: flex; flex-direction: column; align-items: center; gap: var(--s-spacing)">
        <RouterLink to="/jogos">
          <PrimeButton
            label="Apostar agora"
            icon="pi pi-american-football"
          />
        </RouterLink>
        <a
          href="https://t.me/+SvMGiAUj4m2FZge4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PrimeButton
            label="Entrar no Telegram"
            severity="secondary"
            variant="outlined"
          >
            <template #icon>
              <font-awesome-icon :icon="['fab', 'telegram']" />
            </template>
          </PrimeButton>
        </a>
      </div>
    </section>

    <!-- ── This week's matches ── -->
    <section class="dashboard-section">
      <h2 class="section-title">Semana {{ configurationStore.currentWeek }}</h2>
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

    <!-- ── NFL News ── -->
    <section class="dashboard-section">
      <h2 class="section-title">Notícias NFL</h2>
      <div
        v-if="isLoadingNews"
        class="news-grid"
      >
        <PrimeSkeleton
          v-for="n in 6"
          :key="n"
          height="120px"
        />
      </div>
      <p
        v-else-if="newsError"
        class="empty-state"
      >
        Não foi possível carregar as notícias.
      </p>
      <div
        v-else
        class="news-grid"
      >
        <a
          v-for="article in news"
          :key="article.id"
          :href="article.links.web.href"
          target="_blank"
          rel="noopener noreferrer"
          class="news-card"
        >
          <img
            v-if="article.image"
            :src="article.image"
            :alt="article.headline"
            class="news-card-img"
          />
          <div class="news-card-body">
            <p class="news-card-headline">{{ article.headline }}</p>
            <p class="news-card-meta">{{ article.byline }} · {{ formatDate(article.published) }}</p>
          </div>
        </a>
      </div>
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
          :class="{ 'ranking-row--me': line.user.id === activeProfile.id }"
        >
          <span class="rank-pos">{{ line.user.position }}º</span>
          <font-awesome-icon
            class="rank-icon"
            :style="{ color: line.user.color }"
            :icon="line.user.icon"
          />
          <span class="rank-name">{{ line.user.name }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const topRanking = computed(() => rankingStore.seasonRanking.slice(0, 10));
const myRankingLine = computed(() => rankingStore.seasonRanking.find((l) => l.user.id === props.activeProfile.id));

// ------ News ------
interface NewsArticle {
  id: number;
  headline: string;
  byline: string;
  published: string;
  image: string | null;
  links: { web: { href: string } };
}

const news = ref<NewsArticle[]>([]);
const isLoadingNews = ref(false);
const newsError = ref(false);

onMounted(async () => {
  isLoadingNews.value = true;
  newsError.value = false;
  try {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?lang=pt-br');
    const data = await res.json();
    news.value = (data.articles ?? []).map((a: any) => ({
      id: a.id,
      headline: a.headline,
      byline: a.byline ?? '',
      published: a.published,
      image: a.images?.find((img: any) => img.type === 'header')?.url ?? null,
      links: a.links
    }));
  } catch {
    newsError.value = true;
  } finally {
    isLoadingNews.value = false;
  }
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
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

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--m-spacing);
}

.news-card {
  display: flex;
  flex-direction: column;
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s,
    transform 0.15s;
  overflow: hidden;

  &:hover {
    border-color: var(--bolao-c-sky);
    transform: translateY(-2px);
  }
}

.news-card-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.news-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--xxs-spacing);
  padding: var(--s-spacing);
  flex: 1;
}

.news-card-headline {
  font-size: var(--s-font-size);
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.4;
}

.news-card-meta {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  margin-top: auto;
  padding-top: var(--xxs-spacing);
}

.empty-state {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  text-align: center;
  padding: var(--xl-spacing) 0;
}
</style>
