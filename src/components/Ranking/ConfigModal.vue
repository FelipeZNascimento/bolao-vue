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
      <h2>Ranking Config</h2>
    </template>
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
        @click="() => handlRowSpacingConfig(rowSpacingLocalObj.value)"
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
import type { ColumnsOption, RowSpacing } from '@/stores/ranking';
import { ref, watch, watchEffect } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  columnConfig: ColumnsOption;
  rowSpacingConfig: RowSpacing;
  handleCloseModal: () => void;
  handlRowSpacingConfig: (newSize: RowSpacing) => void;
  handleColumnConfig: (newOption: ColumnsOption) => void;
}>();

type TRowSpacing = { label: string; value: RowSpacing };
type TColumn = { label: string; value: ColumnsOption };

// ------ Refs ------
const isVisible = ref(false);
const rowSpacingLocalObj = ref();
const columnLocalObj = ref();
const rowSpacingOptions = ref<TRowSpacing[]>([
  { label: 'Pequeno', value: 'small' },
  { label: 'Normal', value: 'normal' },
]);
const columnOptions = ref<TColumn[]>([
  { label: 'Compacto', value: 'COMPACT' },
  { label: 'Completo', value: 'COMPLETE' },
]);

// ------ Watch Effect Properties ------
watchEffect(
  () =>
    (rowSpacingLocalObj.value = rowSpacingOptions.value.find(
      (option) => option.value === props.rowSpacingConfig,
    )),
);

watchEffect(
  () =>
    (columnLocalObj.value = columnOptions.value.find(
      (option) => option.value === props.columnConfig,
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
