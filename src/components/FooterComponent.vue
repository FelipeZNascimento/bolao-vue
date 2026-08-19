<template>
  <footer class="app-footer">
    <a
      href="https://github.com/FelipeZNascimento/bolao-vue"
      target="_blank"
      rel="noopener noreferrer"
    >
      <font-awesome-icon :icon="['fab', 'github']" />
      v{{ version }}
    </a>
  </footer>
</template>

<script setup lang="ts">
declare const __APP_VERSION__: string;
const version = __APP_VERSION__;
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
    color: var(--nav-link);
    font-size: var(--xs-font-size);
    transition: color 0.2s;

    &:hover {
      color: var(--nav-link-hover);
    }
  }
}
</style>
