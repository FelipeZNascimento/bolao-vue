<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    position="top"
    :style="{ width: '400px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Fleaflicker</h2>
    </template>

    <div class="content">
      <PrimeFloatLabel
        variant="in"
        class="input"
      >
        <PrimeInputText
          v-model="leagueId"
          name="leagueId"
          type="number"
          fluid
          autofocus
        />
        <label for="leagueId">League ID</label>
      </PrimeFloatLabel>

      <PrimeFloatLabel
        variant="in"
        class="input"
      >
        <PrimeInputText
          v-model="teamId"
          name="teamId"
          type="number"
          fluid
        />
        <label for="teamId">Team ID</label>
      </PrimeFloatLabel>

      <PrimeMessage
        v-if="testError"
        severity="error"
        variant="outlined"
      >
        {{ testError }}
      </PrimeMessage>
      <PrimeMessage
        v-if="testSuccess"
        severity="success"
        variant="outlined"
      >
        Conexão verificada com sucesso!
      </PrimeMessage>
    </div>

    <template #footer>
      <div class="footer-buttons">
        <PrimeButton
          label="Testar"
          variant="outlined"
          severity="secondary"
          icon="pi pi-bolt"
          :loading="isTesting"
          :disabled="!canTest"
          @click="handleTest"
        />
        <PrimeButton
          label="Confirmar"
          icon="pi pi-check"
          :loading="isConfirming"
          :disabled="!testSuccess"
          @click="handleConfirm"
        />
      </div>
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ApiService from '@/services/api_request';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const leagueId = ref('');
const teamId = ref('');
const isTesting = ref(false);
const isConfirming = ref(false);
const testSuccess = ref(false);
const testError = ref<string | null>(null);

// ------ Initializations ------
const apiService = new ApiService();

// ------ Computed ------
const canTest = computed(() => leagueId.value.trim() !== '' && teamId.value.trim() !== '');

// ------ Functions ------
async function handleTest() {
  testSuccess.value = false;
  testError.value = null;
  isTesting.value = true;
  try {
    await apiService.get(`fleaflicker/roster/${leagueId.value}/${teamId.value}`);
    testSuccess.value = true;
  } catch (e) {
    testError.value = e instanceof Error ? e.message : 'Erro ao conectar com a Fleaflicker.';
  } finally {
    isTesting.value = false;
  }
}

async function handleConfirm() {
  isConfirming.value = true;
  try {
    await apiService.post('fleaflicker/info', {
      leagueId: Number(leagueId.value),
      teamId: Number(teamId.value)
    });
    isVisible.value = false;
  } catch (e) {
    testError.value = e instanceof Error ? e.message : 'Erro ao salvar.';
  } finally {
    isConfirming.value = false;
  }
}

function resetState() {
  leagueId.value = '';
  teamId.value = '';
  testSuccess.value = false;
  testError.value = null;
}

// ------ Watches ------
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      resetState();
      isVisible.value = true;
    }
  }
);

watch(isVisible, (newValue) => {
  if (!newValue) props.handleCloseModal();
});

// Reset test state when inputs change
watch([leagueId, teamId], () => {
  testSuccess.value = false;
  testError.value = null;
});
</script>
<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.input {
  width: 100%;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--m-spacing);
  width: 100%;
}
</style>
