<template>
  <div class="history-view">
    <h1>Histórico</h1>

    <div
      v-if="isLoading"
      class="history-state"
    >
      <PrimeProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="4"
      />
    </div>

    <div
      v-else-if="error"
      class="history-state history-state--error"
    >
      <i class="pi pi-exclamation-triangle" />
      {{ error }}
    </div>

    <template v-else-if="records">
      <p class="history-subtitle">Melhores desempenhos de todos os tempos por temporada</p>

      <div class="history-filters">
        <PrimeInputText
          v-model="filterUser"
          placeholder="Filtrar por usuário"
          size="small"
        />
        <PrimeMultiSelect
          v-model="filterSeasons"
          :options="seasonOptions"
          placeholder="Filtrar por temporada"
          size="small"
          display="chip"
        />
      </div>

      <PrimeDataTable
        :value="filteredRecords"
        sortField="percentage"
        :sortOrder="-1"
        size="small"
        :paginator="true"
        :rows="25"
        class="history-table"
      >
        <PrimeColumn
          field="season.label"
          header="Temporada"
          sortable
        />
        <PrimeColumn
          field="user.name"
          header="Usuário"
          sortable
        >
          <template #body="{ data }">
            <IconAndName
              class="clickable"
              :color="data.user.color"
              :icon="data.user.icon"
              :name="data.user.name"
              @click="() => openUserTrackingModal(data.user)"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="position"
          header="Posição"
          sortable
        >
          <template #body="{ data }">{{ data.position }}º / {{ data.totalParticipants }}</template>
        </PrimeColumn>
        <PrimeColumn
          field="points"
          header="Pontos"
          sortable
        />
        <PrimeColumn
          field="extras"
          header="Extras"
          sortable
        />
        <PrimeColumn
          field="percentage"
          header="%"
          sortable
        >
          <template #body="{ data }">{{ data.percentage }}%</template>
        </PrimeColumn>
        <PrimeColumn
          field="bullseye"
          header="Mosca"
          sortable
        />
        <PrimeColumn
          field="winner"
          header="Venc."
          sortable
        />
        <PrimeColumn
          field="totalBets"
          header="Apostas"
          sortable
        />
      </PrimeDataTable>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import IconAndName from '@/components/IconAndName.vue';
import type { ISeasonRecord, ISeasonRecordsResponse } from '@/components/Modals/userRecords.types';
import ApiService from '@/services/api_request';
import { useModalsStore } from '@/stores/modals';

const records = ref<ISeasonRecord[] | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const filterUser = ref('');
const filterSeasons = ref<string[]>([]);

const seasonOptions = computed(() => {
  if (!records.value) return [];
  return [...new Set(records.value.map((r) => r.season.label))].sort();
});

const filteredRecords = computed(() => {
  if (!records.value) return [];
  return records.value.filter((r) => {
    const matchesUser = !filterUser.value || r.user.name.toLowerCase().includes(filterUser.value.toLowerCase());
    const matchesSeason = filterSeasons.value.length === 0 || filterSeasons.value.includes(r.season.label);
    return matchesUser && matchesSeason;
  });
});

const apiService = new ApiService();
const { openUserTrackingModal } = useModalsStore();

async function fetchRecords() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiService.get<ISeasonRecordsResponse>('user/records/seasons');
    records.value = response.all;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar histórico.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchRecords);
</script>

<style lang="scss" scoped>
.history-view {
  padding: var(--xl-spacing) var(--l-spacing);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);

  h1 {
    font-size: var(--xl-font-size);
    font-weight: 700;
  }
}

.history-subtitle {
  font-size: var(--s-font-size);
  color: var(--p-text-muted-color);
  margin: 0;
}

.history-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-spacing);
  padding: var(--xxxl-spacing);
  color: var(--p-text-muted-color);

  &--error {
    color: var(--p-red-400);
  }
}

.history-filters {
  display: flex;
  gap: var(--s-spacing);
  flex-wrap: wrap;
}

.history-table {
  width: 100%;
}
.clickable {
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}
</style>
