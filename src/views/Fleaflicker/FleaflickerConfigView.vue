<template>
  <div class="config-view">
    <div class="config-card">
      <h2 class="config-title">
        <i class="pi pi-link" />
        Conexão Fleaflicker
      </h2>

      <div class="config-fields">
        <PrimeFloatLabel variant="in">
          <PrimeInputText
            v-model="leagueId"
            name="leagueId"
            type="number"
            fluid
            :disabled="isBusy"
          />
          <label for="leagueId">League ID</label>
        </PrimeFloatLabel>

        <PrimeFloatLabel variant="in">
          <PrimeInputText
            v-model="teamId"
            name="teamId"
            type="number"
            fluid
            :disabled="isBusy"
          />
          <label for="teamId">Team ID</label>
        </PrimeFloatLabel>
      </div>

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

      <div class="config-actions">
        <PrimeButton
          v-if="isLinked"
          label="Desvincular"
          icon="pi pi-times"
          severity="danger"
          variant="outlined"
          :loading="isUnlinking"
          :disabled="!activeProfile?.fleaflicker"
          @click="handleUnlink"
        />
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import ApiService from '@/services/api_request';
import { useActiveProfileStore } from '@/stores/activeProfile';

const { isLinked } = defineProps<{
  isLinked: boolean;
}>();

const activeProfileStore = useActiveProfileStore();
const { activeProfile } = storeToRefs(activeProfileStore);
const apiService = new ApiService();

const leagueId = ref(String(activeProfile.value?.fleaflicker?.leagueId ?? ''));
const teamId = ref(String(activeProfile.value?.fleaflicker?.teamId ?? ''));
const isTesting = ref(false);
const isConfirming = ref(false);
const isUnlinking = ref(false);
const testSuccess = ref(false);
const testError = ref<string | null>(null);

const isBusy = computed(() => isTesting.value || isConfirming.value || isUnlinking.value);
const canTest = computed(() => !isBusy.value && leagueId.value.trim() !== '' && teamId.value.trim() !== '');

watch([leagueId, teamId], () => {
  testSuccess.value = false;
  testError.value = null;
});

// Keep fields in sync if activeProfile changes externally
watch(activeProfile, (profile) => {
  leagueId.value = String(profile?.fleaflicker?.leagueId ?? '');
  teamId.value = String(profile?.fleaflicker?.teamId ?? '');
});

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
    const linkedLeagueId = Number(leagueId.value);
    const linkedTeamId = Number(teamId.value);
    await apiService.post('fleaflicker/info', { leagueId: linkedLeagueId, teamId: linkedTeamId });
    if (activeProfile.value) {
      activeProfileStore.setActiveProfile({
        ...activeProfile.value,
        fleaflicker: { leagueId: linkedLeagueId, teamId: linkedTeamId }
      });
    }
    testSuccess.value = false;
  } catch (e) {
    testError.value = e instanceof Error ? e.message : 'Erro ao salvar.';
  } finally {
    isConfirming.value = false;
  }
}

async function handleUnlink() {
  isUnlinking.value = true;
  testError.value = null;
  try {
    await apiService.delete('fleaflicker/info');
    if (activeProfile.value) {
      activeProfileStore.setActiveProfile({ ...activeProfile.value, fleaflicker: null });
    }
  } catch (e) {
    testError.value = e instanceof Error ? e.message : 'Erro ao desvincular.';
  } finally {
    isUnlinking.value = false;
  }
}
</script>
<style scoped>
.config-view {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--xl-spacing);
}

.config-card {
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
  padding: var(--xl-spacing);
  border: 1px solid light-dark(var(--bolao-c-grey2), var(--bolao-c-grey6));
  border-radius: var(--m-border-radius);
  width: 100%;
  max-width: 400px;
}

.config-title {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  font-size: var(--m-font-size);
  color: light-dark(var(--bolao-c-grey6), var(--bolao-c-grey2));

  i {
    color: var(--p-primary-color);
  }
}

.config-fields {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--s-spacing);
  flex-wrap: wrap;
}
</style>
