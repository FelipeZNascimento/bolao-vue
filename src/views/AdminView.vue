<template>
  <div class="outer-admin">
    <h1>Admin</h1>
    <PrimeTabs
      v-model:value="activeSection"
      lazy
    >
      <PrimeTabList>
        <PrimeTab value="users">
          <i class="pi pi-users" />
          Usuários
        </PrimeTab>
        <PrimeTab value="cache">
          <i class="pi pi-server" />
          Cache
        </PrimeTab>
      </PrimeTabList>
      <PrimeTabPanels>
        <PrimeTabPanel value="users">
          <AdminUsers />
        </PrimeTabPanel>
        <PrimeTabPanel value="cache">
          <AdminCache />
        </PrimeTabPanel>
      </PrimeTabPanels>
    </PrimeTabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminCache from './Admin/AdminCache.vue';
import AdminUsers from './Admin/AdminUsers.vue';

const activeSection = ref('users');
</script>

<style scoped>
.outer-admin {
  padding: var(--xl-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--l-spacing);
}
</style>
