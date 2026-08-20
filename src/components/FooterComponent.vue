<template>
  <footer class="app-footer">
    <template v-if="activeProfile?.admin">
      <RouterLink
        to="/admin"
        class="admin-link"
      >
        Admin
      </RouterLink>
      <span style="padding: 0 var(--xs-spacing)">·</span>
    </template>

    <a
      href="https://github.com/FelipeZNascimento/bolao-vue"
      target="_blank"
      rel="noopener noreferrer"
    >
      <font-awesome-icon :icon="['fab', 'github']" />
      v{{ version }}
    </a>
    <span style="padding: 0 var(--xs-spacing)">·</span>
    <a
      href="https://t.me/+SvMGiAUj4m2FZge4"
      target="_blank"
      rel="noopener noreferrer"
    >
      <font-awesome-icon :icon="['fab', 'telegram']" />
      Telegram
    </a>
    <span style="padding: 0 var(--xs-spacing)">·</span>
    <button
      class="theme-toggle"
      :title="isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
      @click="toggleTheme"
    >
      <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />
    </button>
  </footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';

declare const __APP_VERSION__: string;
const version = __APP_VERSION__;

const configurationStore = useConfigurationStore();
const isDark = computed(() => configurationStore.theme === 'dark');

const { activeProfile } = storeToRefs(useActiveProfileStore());

function toggleTheme() {
  configurationStore.setTheme(isDark.value ? 'light' : 'dark');
}
</script>

<style scoped>
.app-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--m-spacing);
  padding: var(--s-spacing);
  background-color: var(--bolao-c-navbar);
  box-shadow: 0 0 15px 1px #0006;

  a {
    display: flex;
    align-items: center;
    gap: var(--xs-spacing);
    color: var(--bolao-c-grey3);
    font-size: var(--xs-font-size);
    transition: color 0.2s;

    &:hover {
      color: var(--bolao-c-grey1);
    }
  }
}

.admin-link {
  color: var(--bolao-c-gold) !important;

  &:hover {
    color: var(--bolao-c-gold) !important;
    opacity: 0.8;
  }
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--bolao-c-grey3);
  font-size: var(--xs-font-size);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: var(--bolao-c-grey1);
  }
}
</style>
