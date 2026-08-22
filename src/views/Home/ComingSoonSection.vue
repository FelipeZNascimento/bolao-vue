<template>
  <section class="coming-soon">
    <h2 class="section-title">Em breve</h2>
    <div class="soon-grid">
      <div
        class="soon-card"
        v-for="item in comingSoon"
        :key="item.title"
      >
        <i :class="`pi ${item.icon}`" />
        <span>{{ item.title }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const comingSoon = [
  { icon: 'pi-trophy', title: 'Histórico de temporadas' },
  { icon: 'pi-chart-line', title: 'Estatísticas pessoais por temporada' },
  { icon: 'pi-bell', title: 'Notificações para avisar de apostas abertas' },
  { icon: 'pi-calendar', title: 'Visualização por semana no calendário' }
];
</script>

<style lang="scss" scoped>
.section-title {
  font-size: var(--l-font-size);
  font-weight: 700;
  color: var(--color-heading);
}

.soon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--m-spacing);
}

.soon-card {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--m-spacing) var(--l-spacing);
  border: 1px dashed var(--bolao-c-grey4);
  color: var(--color-contrast);
  font-size: var(--xs-font-size);
  i {
    font-size: var(--m-font-size);
    color: var(--bolao-c-grey3);
  }
}
</style>
