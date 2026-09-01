<template>
  <div class="outer-admin">
    <div class="admin-header">
      <h1>Admin</h1>
      <PrimeButton
        icon="pi pi-refresh"
        severity="secondary"
        variant="outlined"
        :loading="isLoading"
        @click="fetchUsers"
      />
    </div>

    <div
      v-if="users.length"
      class="stats-row"
    >
      <div class="stat-card">
        <span class="stat-label">Total de usuários</span>
        <span class="stat-value">{{ users.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Usuários ativos</span>
        <span class="stat-value">{{ activeCount }}/{{ users.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Extras completas</span>
        <span class="stat-value">{{ extrasCompleteCount }}/{{ users.length }}</span>
      </div>
    </div>

    <PrimeMessage
      v-if="error"
      severity="error"
      variant="outlined"
    >
      {{ error.message }}
    </PrimeMessage>

    <PrimeDataTable
      v-else
      :value="users"
      :loading="isLoading"
      stripedRows
      sortField="id"
      :sortOrder="1"
      size="small"
    >
      <PrimeColumn
        field="id"
        header="ID"
        sortable
      />
      <PrimeColumn
        field="name"
        header="Username"
        sortable
      />
      <PrimeColumn
        field="fullName"
        header="Nome"
        sortable
      />
      <PrimeColumn
        field="email"
        header="Email"
        sortable
      />
      <PrimeColumn
        field="balance"
        header="Saldo"
        sortable
      >
        <template #body="{ data }">
          <div class="balance-cell">
            <PrimeButton
              label="Set"
              size="small"
              variant="outlined"
              @click="openBalanceDialog(data)"
            />
            {{ (data.balance ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="extraBetsCount"
        header="Extras"
        sortable
      >
        <template #body="{ data }">
          <i
            :class="data.extraBetsCount === 17 ? 'pi pi-check' : 'pi pi-times'"
            :style="{ color: data.extraBetsCount === 17 ? 'var(--bolao-c-mint)' : 'var(--p-red-400)' }"
          />
          {{ data.extraBetsCount }}
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="active"
        header="Ativo"
        sortable
      >
        <template #body="{ data }">
          <div class="active-cell">
            <i
              :class="data.active ? 'pi pi-check' : 'pi pi-times'"
              :style="{ color: data.active ? 'var(--bolao-c-mint)' : 'var(--p-red-400)' }"
            />
            <PrimeButton
              :label="data.active ? 'Desativar' : 'Ativar'"
              :severity="data.active ? 'danger' : 'success'"
              size="small"
              variant="outlined"
              :loading="togglingId === data.id"
              @click="confirmActivationToggle(data)"
            />
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn
        field="admin"
        header="Admin"
        sortable
      >
        <template #body="{ data }">
          <i
            v-if="data.admin"
            class="pi pi-shield"
            style="color: var(--bolao-c-gold)"
          />
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>

  <!-- Balance dialog -->
  <PrimeDialog
    v-model:visible="isBalanceDialogOpen"
    modal
    dismissableMask
    :draggable="false"
    :header="`Saldo — ${balanceTarget?.name}`"
    :style="{ width: '90vw', maxWidth: '400px' }"
    @hide="resetBalanceDialog"
  >
    <PrimeTabs v-model:value="balanceTab">
      <PrimeTabList>
        <PrimeTab value="add">Adicionar</PrimeTab>
        <PrimeTab value="remove">Remover</PrimeTab>
        <PrimeTab value="force">Forçar</PrimeTab>
      </PrimeTabList>
      <PrimeTabPanels>
        <!-- Adicionar -->
        <PrimeTabPanel value="add">
          <div class="balance-tab-content">
            <input
              v-model.number="balanceAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="balance-input"
            />
            <p class="balance-preview">
              Novo saldo:
              <strong>{{ previewBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</strong>
            </p>
          </div>
        </PrimeTabPanel>
        <!-- Remover -->
        <PrimeTabPanel value="remove">
          <div class="balance-tab-content">
            <input
              v-model.number="balanceAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="balance-input"
            />
            <p class="balance-preview">
              Novo saldo:
              <strong>{{ previewBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</strong>
            </p>
          </div>
        </PrimeTabPanel>
        <!-- Forçar -->
        <PrimeTabPanel value="force">
          <div class="balance-tab-content">
            <input
              v-model.number="balanceAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              class="balance-input"
            />
            <p class="balance-preview">
              Novo saldo:
              <strong>{{ previewBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</strong>
            </p>
          </div>
        </PrimeTabPanel>
      </PrimeTabPanels>
    </PrimeTabs>

    <template #footer>
      <PrimeButton
        label="Cancelar"
        severity="secondary"
        variant="outlined"
        @click="isBalanceDialogOpen = false"
      />
      <PrimeButton
        label="Confirmar"
        :loading="isUpdatingBalance"
        @click="confirmBalance"
      />
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm';
import { computed, onMounted, ref } from 'vue';
import ApiService from '@/services/api_request';
import type { IUser } from '@/stores/activeProfile.types';

// ── Balance dialog ──
const isBalanceDialogOpen = ref(false);
const isUpdatingBalance = ref(false);
const balanceTarget = ref<IUser | null>(null);
const balanceTab = ref<'add' | 'remove' | 'force'>('add');
const balanceAmount = ref(0);

const previewBalance = computed(() => {
  const current = balanceTarget.value?.balance ?? 0;
  const amount = balanceAmount.value || 0;
  if (balanceTab.value === 'add') return Math.round((current + amount) * 100) / 100;
  if (balanceTab.value === 'remove') return Math.round((current - amount) * 100) / 100;
  return amount;
});

function openBalanceDialog(user: IUser) {
  balanceTarget.value = user;
  balanceTab.value = 'add';
  balanceAmount.value = 0;
  isBalanceDialogOpen.value = true;
}

function resetBalanceDialog() {
  balanceTarget.value = null;
  balanceAmount.value = 0;
}

async function confirmBalance() {
  if (!balanceTarget.value) return;
  isUpdatingBalance.value = true;
  try {
    const newBalance = previewBalance.value;
    const updatedUser = await apiService.post<IUser>(`user/admin/update-balance/${balanceTarget.value.id}`, {
      balance: newBalance
    });
    const idx = users.value.findIndex((u) => u.id === updatedUser.id);
    if (idx !== -1) users.value[idx] = updatedUser;
    isBalanceDialogOpen.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e : new Error(String(e));
  } finally {
    isUpdatingBalance.value = false;
  }
}

const apiService = new ApiService();
const confirm = useConfirm();

const users = ref<IUser[]>([]);
const isLoading = ref(false);
const error = ref<Error | null>(null);
const togglingId = ref<null | number>(null);

const activeCount = computed(() => users.value.filter((u) => u.active).length);
const extrasCompleteCount = computed(() => users.value.filter((u) => u.extraBetsCount === 17).length);

async function fetchUsers() {
  isLoading.value = true;
  error.value = null;
  try {
    users.value = await apiService.get<IUser[]>('user/admin/');
  } catch (e) {
    error.value = e instanceof Error ? e : new Error(String(e));
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchUsers);

function confirmActivationToggle(user: IUser) {
  const activating = !user.active;
  confirm.require({
    message: activating
      ? `Tem certeza que deseja ativar a conta de ${user.name}?`
      : `Tem certeza que deseja desativar a conta de ${user.name}?`,
    header: activating ? 'Ativar conta' : 'Desativar conta',
    icon: activating ? 'pi pi-user-plus' : 'pi pi-user-minus',
    rejectLabel: 'Cancelar',
    acceptLabel: activating ? 'Ativar' : 'Desativar',
    acceptProps: { severity: activating ? 'success' : 'danger' },
    accept: () => toggleActiveStatus(user)
  });
}

async function toggleActiveStatus(user: IUser) {
  togglingId.value = user.id;
  try {
    const updated = await apiService.get<IUser[]>(`user/admin/toggle-active-status/${user.id}`);
    users.value = updated;
  } catch (e) {
    error.value = e instanceof Error ? e : new Error(String(e));
  } finally {
    togglingId.value = null;
  }
}
</script>

<style scoped>
.outer-admin {
  padding: var(--xl-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
}

.balance-cell {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.balance-tab-content {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  padding: var(--l-spacing);
}

.balance-input {
  width: 100%;
  padding: var(--s-spacing) var(--m-spacing);
  background: var(--p-inputtext-background, transparent);
  border: 1px solid var(--p-inputtext-border-color, var(--bolao-c-grey4));
  border-radius: var(--p-border-radius-sm, 4px);
  color: inherit;
  font-size: inherit;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--p-primary-color);
    box-shadow: 0 0 0 1px var(--p-primary-color);
  }

  /* Hide browser spinners */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}

.balance-preview {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey2);
}

.active-cell {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
}
.admin-header {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
}

.stats-row {
  display: flex;
  gap: var(--m-spacing);
  flex-wrap: wrap;

  @media (max-width: 767px) {
    gap: var(--s-spacing);
  }
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--m-spacing) var(--l-spacing);
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-border-radius-md);
  min-width: 160px;

  .stat-label {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--p-text-color);
  }

  @media (max-width: 767px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-width: unset;
    flex: 1;
    padding: var(--s-spacing) var(--m-spacing);
    gap: var(--s-spacing);

    .stat-label {
      font-size: 0.7rem;
    }

    .stat-value {
      font-size: 1.1rem;
    }
  }
}
</style>
