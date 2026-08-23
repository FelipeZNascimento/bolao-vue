<template>
  <section class="dashboard-section">
    <div class="section-header">
      <h2 class="section-title">ESPN NFL News</h2>
      <div class="lang-flags">
        <span
          class="lang-flag"
          :class="{ 'lang-flag--active': activeLang === 'pt-br' }"
          v-tooltip.top="'Português'"
          @click="switchLang('pt-br')"
        >
          <FlagIcon
            code="BR"
            square
            :size="20"
          />
        </span>
        <span
          class="lang-flag"
          :class="{ 'lang-flag--active': activeLang === 'en' }"
          v-tooltip.top="'English'"
          @click="switchLang('en')"
        >
          <FlagIcon
            code="US"
            square
            :size="20"
          />
        </span>
      </div>
    </div>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FlagIcon from 'vue3-flag-icons';

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
const activeLang = ref<'pt-br' | 'en'>('pt-br');
const newsBaseUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news';

onMounted(() => {
  fetchNews(activeLang.value);
});

function switchLang(lang: 'pt-br' | 'en') {
  if (activeLang.value === lang) return;
  activeLang.value = lang;
  fetchNews(lang);
}

async function fetchNews(lang: 'pt-br' | 'en') {
  isLoadingNews.value = true;
  newsError.value = false;
  const langParam = `?lang=${lang}`;
  try {
    const res = await fetch(`${newsBaseUrl}${langParam}`);
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
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
</script>

<style lang="scss" scoped>
.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.section-title {
  font-size: var(--l-font-size);
  font-weight: 700;
  color: var(--color-heading);
}

.lang-flags {
  display: flex;
  gap: var(--xs-spacing);
}

.lang-flag {
  font-size: var(--m-font-size);
  cursor: pointer;
  opacity: 0.35;
  transition:
    opacity 0.2s,
    transform 0.15s;

  &:hover {
    opacity: 0.7;
  }

  &--active {
    opacity: 1;
    transform: scale(1.2);
  }
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
