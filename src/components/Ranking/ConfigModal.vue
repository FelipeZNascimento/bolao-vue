<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    position="right"
    :style="{ width: '400px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Configurações</h2>
    </template>
    <h2>Tema</h2>
    <div class="button-group">
      <div class="label">Tema</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="themeLocalObj"
        :options="themeOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleThemeConfig(themeLocalObj.value)"
      />
    </div>
    <PrimeDivider />
    <h2>Resultados</h2>
    <div class="button-group">
      <div class="label">Mostrar</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="resultsViewLocalObj"
        :options="resultsViewOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleResultsViewConfig(resultsViewLocalObj.value)"
      />
    </div>
    <PrimeDivider />

    <h2>Ranking</h2>
    <div class="button-group">
      <div class="label">Espaçamento</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="rowSpacingLocalObj"
        :options="rowSpacingOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleRowSpacingConfig(rowSpacingLocalObj.value)"
      />
    </div>
    <div class="button-group">
      <div class="label">Modo</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="columnLocalObj"
        :options="columnOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleColumnConfig(columnLocalObj.value)"
      />
    </div>

    <template #footer> </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { useConfigurationStore, type ResultsView, type Theme } from '@/stores/configuration';
import { useRankingStore, type ColumnsOption, type RowSpacing } from '@/stores/ranking';
import { computed, ref, watch, watchEffect } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  handleCloseModal: () => void;
}>();

type TRowSpacing = { label: string; value: RowSpacing };
type TColumn = { label: string; value: ColumnsOption };
type TTheme = { label: string; value: Theme };
type TResultsView = { label: string; value: ResultsView };

// ------ Refs ------
const isVisible = ref(false);
const themeLocalObj = ref();
const resultsViewLocalObj = ref();
const rowSpacingLocalObj = ref();
const columnLocalObj = ref();
const themeOptions = ref<TTheme[]>([
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
]);
const resultsViewOptions = ref<TResultsView[]>([
  { label: 'Grid', value: 'grid' },
  { label: 'Linhas', value: 'lines' },
]);
const rowSpacingOptions = ref<TRowSpacing[]>([
  { label: 'Pequeno', value: 'small' },
  { label: 'Normal', value: 'normal' },
]);
const columnOptions = ref<TColumn[]>([
  { label: 'Compacto', value: 'COMPACT' },
  { label: 'Completo', value: 'COMPLETE' },
]);

// ------ Initialization ------
const rankingStore = useRankingStore();
const configurationStore = useConfigurationStore();

// ------ Computed Properties ------
const columnConfig = computed(() => rankingStore.columnsOption);
const rowSpacingConfig = computed(() => rankingStore.rowSpacing);
const theme = computed(() => configurationStore.theme);
const resultsView = computed(() => configurationStore.resultsView);

// ------ Functions  ------
function handleColumnConfig(newOption: ColumnsOption) {
  rankingStore.setColumnsOption(newOption);
}

function handleRowSpacingConfig(newOption: RowSpacing) {
  rankingStore.setRowSpacing(newOption);
}

function handleThemeConfig(newOption: Theme) {
  configurationStore.setTheme(newOption);
}

function handleResultsViewConfig(newOption: ResultsView) {
  configurationStore.setResultsView(newOption);
}

// ------ Watch Effect Properties ------
watchEffect(
  () =>
    (resultsViewLocalObj.value = resultsViewOptions.value.find(
      (option) => option.value === resultsView.value,
    )),
);

watchEffect(
  () => (themeLocalObj.value = themeOptions.value.find((option) => option.value === theme.value)),
);

watchEffect(
  () =>
    (rowSpacingLocalObj.value = rowSpacingOptions.value.find(
      (option) => option.value === rowSpacingConfig.value,
    )),
);

watchEffect(
  () =>
    (columnLocalObj.value = columnOptions.value.find(
      (option) => option.value === columnConfig.value,
    )),
);

// ------ Watches ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style scoped>
.input {
  padding-bottom: var(--m-spacing);
}
.buttons-container {
  display: flex;
  justify-content: center;
  gap: var(--m-spacing);
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: var(--xxs-spacing) 0;

  .label {
    flex: 2;
  }

  .buttons {
    flex: 3;
  }
}
</style>
