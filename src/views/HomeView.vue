<template>
  <div
    v-if="isLoading"
    class="loading-state"
  >
    <img
      class="loading-helmet"
      src="/src/img/logo.png"
      alt="Carregando..."
    />
    <p class="loading-text">Carregando...</p>
  </div>
  <HomeUser
    v-else-if="activeProfile"
    :active-profile="activeProfile"
  />
  <HomeGuest v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import HomeGuest from '@/views/Home/HomeGuest.vue';
import HomeUser from '@/views/Home/HomeUser.vue';

const activeProfileStore = useActiveProfileStore();
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoading = computed(() => activeProfileStore.isLoading);
</script>

<style lang="scss" scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--l-spacing);
  padding: var(--xxxl-spacing);
}

.loading-helmet {
  width: 80px;
  height: 80px;
  object-fit: contain;
  animation: helmet-run 0.8s ease-in-out infinite alternate;
  transform-origin: center bottom;
}

.loading-text {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  letter-spacing: 0.05em;
}

@keyframes helmet-run {
  0% {
    transform: translateY(0) rotate(-8deg) scale(1);
  }
  40% {
    transform: translateY(-18px) rotate(4deg) scale(1.05);
  }
  100% {
    transform: translateY(-4px) rotate(10deg) scale(0.97);
  }
}
</style>
