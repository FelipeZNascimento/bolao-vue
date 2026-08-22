<template>
  <div class="outer-rules">
    <h1>Regras</h1>
    <div style="display: flex; gap: var(--m-spacing); flex-wrap: wrap; justify-content: center">
      <PrimeButton
        v-for="section in sections"
        :key="section.id"
        :label="section.label"
        severity="secondary"
        :class="{ 'nav-btn--active': activeId === section.id }"
        @click="scrollTo(section.id)"
      />
    </div>
    <section id="inscricao"><RulesSubscription /></section>
    <section id="pontuacao"><RulesScores /></section>
    <section id="apostas"><RulesBetting /></section>
    <section id="extras"><RulesExtras /></section>
    <section id="premiacao"><RulesPrize /></section>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RulesBetting from './Rules/RulesBetting.vue';
import RulesExtras from './Rules/RulesExtras.vue';
import RulesPrize from './Rules/RulesPrize.vue';
import RulesScores from './Rules/RulesScores.vue';
import RulesSubscription from './Rules/RulesSubscription.vue';

const sections = [
  { id: 'inscricao', label: 'Inscrição' },
  { id: 'pontuacao', label: 'Pontuação' },
  { id: 'apostas', label: 'Apostas' },
  { id: 'extras', label: 'Extras' },
  { id: 'premiacao', label: 'Premiação' }
];

const route = useRoute();
const router = useRouter();

const activeId = ref(route.hash.slice(1));

function scrollTo(id: string) {
  activeId.value = id;
  router.replace({ hash: `#${id}` });
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el?.classList.remove('section--flash');
  requestAnimationFrame(() => {
    el?.classList.add('section--flash');
  });
}

onMounted(() => {
  const id = route.hash.slice(1);
  if (id) {
    activeId.value = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
</script>
<style lang="scss" scoped>
.outer-rules {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-spacing);

  section {
    width: 100%;
    scroll-margin-top: calc(var(--navbar-height) + var(--m-spacing));
  }

  :deep(.nav-btn--active) {
    background-color: var(--bolao-c-grey1) !important;
    color: var(--bolao-c-navy) !important;
    border-color: var(--color-contrast) !important;
  }
  padding: var(--l-spacing) 160px;
  flex: 1;

  @media (max-width: 767px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}
</style>

<style>
@keyframes section-flash {
  0% {
    box-shadow: 0 0 0 3px var(--bolao-c-gold);
  }
  70% {
    box-shadow: 0 0 0 3px var(--bolao-c-gold);
  }
  100% {
    box-shadow: 0 0 0 0px transparent;
  }
}

.section--flash {
  animation: section-flash 1.6s ease-out forwards;
}
</style>
