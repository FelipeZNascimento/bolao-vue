<template>
  <section class="greeting">
    <div class="greeting-left">
      <font-awesome-icon
        class="greeting-icon"
        :style="{ color: activeProfile.color }"
        :icon="activeProfile.icon"
      />
      <div>
        <h1 class="greeting-title">Olá, {{ activeProfile.name }}!</h1>
        <p
          v-if="myRankingLine"
          class="greeting-sub"
        >
          Você está em
          <strong>{{ myRankingLine.user.position }}º lugar</strong>
          com
          <strong>{{ myRankingLine.score.total }} pts</strong>
          na temporada.
        </p>
        <p
          v-else
          class="greeting-sub"
        >
          Bem-vindo ao Bolão NFL!
        </p>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--s-spacing)">
      <RouterLink to="/jogos">
        <PrimeButton
          label="Apostar agora"
          icon="pi pi-american-football"
        />
      </RouterLink>
      <a
        href="https://t.me/+SvMGiAUj4m2FZge4"
        target="_blank"
        rel="noopener noreferrer"
      >
        <PrimeButton
          label="Entrar no Telegram"
          severity="secondary"
          variant="outlined"
        >
          <template #icon>
            <font-awesome-icon :icon="['fab', 'telegram']" />
          </template>
        </PrimeButton>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { IUser } from '@/stores/activeProfile.types';
import type { IRankingLine } from '@/stores/ranking.types';

defineProps<{
  activeProfile: IUser;
  myRankingLine: IRankingLine | undefined;
}>();
</script>

<style lang="scss" scoped>
.greeting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--l-spacing);
  padding: var(--xl-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  flex-wrap: wrap;
  a {
    text-decoration: none;
  }
}

.greeting-left {
  display: flex;
  align-items: center;
  gap: var(--l-spacing);
}

.greeting-icon {
  font-size: 48px;
}

.greeting-title {
  font-size: var(--xl-font-size);
  font-weight: 800;
  color: var(--color-heading);
}

.greeting-sub {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  margin-top: var(--xxs-spacing);
}
</style>
