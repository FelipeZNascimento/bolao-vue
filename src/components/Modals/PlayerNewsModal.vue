<template>
  <PrimeDialog
    :visible="isOpen"
    modal
    dismissableMask
    :header="news?.title"
    :style="{ width: '90vw', maxWidth: '480px' }"
    :draggable="false"
    @update:visible="(v: boolean) => !v && handleCloseModal()"
  >
    <p
      v-if="news"
      class="news-body"
    >
      {{ news.contents }}
    </p>
    <template #footer>
      <a
        v-if="news?.url"
        :href="news.url"
        target="_blank"
        rel="noopener noreferrer"
        class="news-link"
      >
        Leia mais <i class="pi pi-external-link" />
      </a>
    </template>
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
const news = computed(() => modalPayload.value as IFleaflickerNews | null);
</script>
<style scoped>
.news-body {
  font-size: var(--s-font-size);
  line-height: 1.5;
  color: var(--bolao-c-grey2);
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
</style>
