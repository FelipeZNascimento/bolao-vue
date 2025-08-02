<template>
  <header>
    <NavbarTop />
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavbarTop from './components/NavbarTop/NavbarTop.vue';
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    background-color: #36424d;
    box-shadow: 0 0 15px 1px #0006;
  }
}
</style>
