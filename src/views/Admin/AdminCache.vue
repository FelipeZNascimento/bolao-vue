<template>
  <div class="cache-section">
    <div class="section-header">
      <h2>Cache</h2>
      <PrimeButton
        icon="pi pi-refresh"
        severity="secondary"
        variant="outlined"
        :loading="cacheLoading"
        @click="service.fetchCache()"
      />
    </div>

    <div
      v-if="cacheStats"
      class="stats-row"
    >
      <div class="stat-card">
        <span class="stat-label">Chaves</span>
        <span class="stat-value">{{ cacheStats.keys }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Hits</span>
        <span class="stat-value">{{ cacheStats.hits }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Misses</span>
        <span class="stat-value">{{ cacheStats.misses }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Hit rate</span>
        <span class="stat-value">{{ hitRate }}</span>
      </div>
    </div>

    <PrimeMessage
      v-if="cacheError"
      severity="error"
      variant="outlined"
    >
      {{ cacheError.message }}
    </PrimeMessage>

    <PrimeDataTable
      v-else
      :value="cacheKeys"
      :loading="cacheLoading"
      stripedRows
      size="small"
    >
      <PrimeColumn
        field="key"
        header="Chave"
        sortable
      />
      <PrimeColumn
        field="expiresAt"
        header="Expira em"
        sortable
      >
        <template #body="{ data }">
          <span :style="{ color: data.expiresAt === null ? 'var(--bolao-c-grey2)' : 'inherit' }">
            {{ data.expiresAt ? new Date(data.expiresAt).toLocaleString('pt-BR') : '∞' }}
          </span>
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="valuePreview"
        header="Preview"
      >
        <template #body="{ data }">
          <span class="preview-cell">{{ data.preview }}</span>
        </template>
      </PrimeColumn>
      <PrimeColumn header="">
        <template #body="{ data }">
          <PrimeButton
            label="Detalhar"
            size="small"
            variant="outlined"
            :loading="loadingKey === data.key"
            @click="openDetail(data.key)"
          />
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>

  <!-- Cache detail modal -->
  <PrimeDialog
    v-model:visible="isDetailOpen"
    modal
    dismissableMask
    :draggable="false"
    :header="selectedKey ?? ''"
    :style="{ width: '90vw', maxWidth: '640px' }"
    @hide="closeDetail"
  >
    <PrimeMessage
      v-if="detailError"
      severity="error"
      variant="outlined"
    >
      {{ detailError.message }}
    </PrimeMessage>
    <pre
      v-else
      class="detail-pre"
      >{{ detailFormatted }}</pre>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import AdminService from '@/services/admin';
import { useAdminStore } from '@/stores/admin';

const store = useAdminStore();
const { cacheKeys, cacheLoading, cacheError, cacheStats } = storeToRefs(store);

const hitRate = computed(() => {
  if (!cacheStats.value) return null;
  const total = cacheStats.value.hits + cacheStats.value.misses;
  if (total === 0) return '—';
  return ((cacheStats.value.hits / total) * 100).toFixed(1) + '%';
});
const service = new AdminService();

// ── Detail modal ────────────────────────────────────────────────────────────
const isDetailOpen = ref(false);
const selectedKey = ref<string | null>(null);
const detailData = ref<unknown>(null);
const detailError = ref<Error | null>(null);
const loadingKey = ref<string | null>(null);

const detailFormatted = computed(() => {
  if (detailData.value === null) return '';
  try {
    return JSON.stringify(detailData.value, null, 2);
  } catch {
    return String(detailData.value);
  }
});

async function openDetail(key: string) {
  selectedKey.value = key;
  detailData.value = null;
  detailError.value = null;
  loadingKey.value = key;
  isDetailOpen.value = true;
  try {
    detailData.value = await service.fetchCacheDetail(key);
  } catch (e) {
    detailError.value = e instanceof Error ? e : new Error(String(e));
  } finally {
    loadingKey.value = null;
  }
}

function closeDetail() {
  selectedKey.value = null;
  detailData.value = null;
  detailError.value = null;
}

onMounted(() => service.fetchCache());
</script>

<style scoped>
.cache-section {
  padding: var(--l-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
}

.stats-row {
  display: flex;
  gap: var(--m-spacing);
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--m-spacing) var(--l-spacing);
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-border-radius-md);
  min-width: 120px;

  .stat-label {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
  }
}

.preview-cell {
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey2);
  font-family: monospace;
}

.detail-pre {
  margin: 0;
  font-size: var(--s-font-size);
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--p-text-color);
  background: var(--p-surface-ground);
  padding: var(--m-spacing);
  border-radius: var(--p-border-radius-sm);
  max-height: 60vh;
  overflow-y: auto;
}
</style>
