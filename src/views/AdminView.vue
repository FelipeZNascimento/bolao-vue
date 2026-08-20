<template>
  <div class="outer-admin">
    <h1>Admin</h1>

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
              @click="confirmToggle(data)"
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
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm';
import { onMounted, ref } from 'vue';
import ApiService from '@/services/api_request';
import type { IUser } from '@/stores/activeProfile.types';

const apiService = new ApiService();
const confirm = useConfirm();

const users = ref<IUser[]>([]);
const isLoading = ref(false);
const error = ref<Error | null>(null);
const togglingId = ref<null | number>(null);

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    users.value = await apiService.get<IUser[]>('user/admin/');
  } catch (e) {
    error.value = e instanceof Error ? e : new Error(String(e));
  } finally {
    isLoading.value = false;
  }
});

function confirmToggle(user: IUser) {
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

.active-cell {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
}
</style>
