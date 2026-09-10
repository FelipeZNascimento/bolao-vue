<template>
  <PrimeDialog
    :visible="isOpen"
    modal
    dismissableMask
    header="Notícias"
    :style="{ width: '90vw', maxWidth: '520px' }"
    :draggable="false"
    @update:visible="(v: boolean) => !v && handleCloseModal()"
  >
    <div
      v-for="(item, index) in news"
      :key="index"
      class="news-item"
      :class="{ 'news-item--divider': index > 0 }"
    >
      <p class="news-title">{{ item.title }}</p>
      <p class="news-body">{{ item.contents }}</p>
      <a
        v-if="item.url"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="news-link"
      >
        Leia mais <i class="pi pi-external-link" />
      </a>
    </div>
    <p
      v-if="!news?.length"
      class="news-empty"
    >
      Nenhuma notícia disponível.
    </p>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import type { IFleaflickerNews } from '@/stores/fleaflicker.types';
import { useModalsStore } from '@/stores/modals';

defineProps<{
  isOpen: boolean;
  handleCloseModal: () => void;
}>();

const { modalPayload } = storeToRefs(useModalsStore());
const news = computed(() => modalPayload.value as IFleaflickerNews[]);
</script>
<style scoped>
.news-item {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding-block: var(--s-spacing);

  &--divider {
    border-top: 1px solid var(--p-content-border-color);
  }
}

.news-title {
  font-size: var(--s-font-size);
  font-weight: 600;
  margin: 0;
}

.news-body {
  font-size: var(--s-font-size);
  line-height: 1.5;
  color: var(--bolao-c-grey2);
  margin: 0;
}

.news-link {
  font-size: var(--s-font-size);
  color: var(--p-primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--xs-spacing);

  &:hover {
    text-decoration: underline;
  }
}

.news-empty {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey2);
}
</style>
