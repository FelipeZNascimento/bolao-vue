<template>
  <nav>
    <img src="/src/img/logo.png" />
    <RouterLink
      v-for="route in ROUTES"
      activeClass="active"
      :to="route.url"
      :key="route.id"
      :class="{ disabled: route.needCredentials, enabled: !route.needCredentials }"
    >
      {{ route.display }}
    </RouterLink>
    <div class="outer-right">
      <button class="button">Login</button>
      <a @click="toggleTheme">
        <p v-if="isDarkMode" class="icon-sun"><font-awesome-icon :icon="['fa', 'sun']" /></p>
        <p v-else class="icon-moon"><font-awesome-icon :icon="['fa', 'moon']" /></p>
      </a>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import { onMounted, ref } from 'vue';
import { ROUTES } from './routes';

const isDarkMode = ref(false);
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initialize();
  isDarkMode.value = themeStore.getTheme() === 'dark';
});

function toggleTheme() {
  themeStore.toggleTheme();
  isDarkMode.value = !isDarkMode.value;
}
</script>
<style scoped>
img {
  max-height: 60px;
}
nav {
  width: 100%;
  font-size: 24px;
  text-align: center;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

nav a {
  display: inline-block;
  padding: 0 12px;
  transition: 0.2s;
  color: var(--nav-link);
}

.outer-right {
  flex: 1;
}

.active {
  color: #f4b303;
}

.enabled {
  &:hover {
    color: var(--nav-link-hover);
  }
}

.disabled {
  cursor: default;
  pointer-events: none;
  color: var(--nav-disabled);
}

.icon-sun,
.icon-moon {
  transition: 0.2s;
}

.icon-sun:hover {
  color: gold;
}

.icon-moon:hover {
  color: black;
}

.button {
  height: 40px;
  min-width: 120px;
  border: 2px solid black;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
</style>
