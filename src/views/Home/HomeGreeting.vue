<template>
  <section class="greeting">
    <div
      class="greeting-left"
      v-if="activeProfile"
    >
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
    <div
      v-if="activeProfileActive"
      class="greeting-right"
    >
      <RouterLink
        to="/jogos"
        style="width: 100%"
      >
        <PrimeButton
          label="Apostar agora"
          icon="pi pi-american-football"
          fluid
        />
      </RouterLink>
      <a
        href="https://t.me/+SvMGiAUj4m2FZge4"
        target="_blank"
        rel="noopener noreferrer"
        style="width: 100%"
      >
        <PrimeButton
          label="Entrar no Telegram"
          severity="secondary"
          variant="outlined"
          fluid
        >
          <template #icon>
            <font-awesome-icon :icon="['fab', 'telegram']" />
          </template>
        </PrimeButton>
      </a>
    </div>
    <div
      v-else
      class="greeting-right"
    >
      <PrimeButton
        v-if="!seasonRegistered"
        label="Inscrever-se na temporada atual"
        @click="openSeasonRegisterModal()"
        fluid
      />
      <div v-else>
        <i
          class="pi pi-check-square"
          style="color: var(--bolao-c-mint)"
        ></i>
        Inscrição feita
      </div>
      <p
        v-if="!seasonRegistered || (seasonRegistered && !activeProfile?.active)"
        style="text-align: center"
      >
        <i
          class="pi pi-stop"
          style="color: var(--bolao-c-red)"
        ></i>

        Assim que confirmarmos seu pagamento, sua conta será liberada!
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import type { IRankingLine } from '@/stores/ranking.types';

defineProps<{
  myRankingLine: IRankingLine | undefined;
}>();

const activeProfileStore = useActiveProfileStore();
const { activeProfile } = storeToRefs(activeProfileStore);
const { currentSeason } = storeToRefs(useConfigurationStore());

const seasonRegistered = computed(() => activeProfile.value && activeProfile.value.seasonId === currentSeason.value);
const activeProfileActive = computed(() => activeProfile.value?.active && seasonRegistered.value);

const { openSeasonRegisterModal } = activeProfileStore;
</script>

<style lang="scss" scoped>
.greeting {
  display: flex;
  align-items: center;
  gap: var(--l-spacing);
  padding: var(--xl-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  flex-wrap: wrap;

  @media (max-width: 1023px) {
    justify-content: center;
  }

  @media (min-width: 1024px) {
    justify-content: space-between;
  }

  a {
    text-decoration: none;
  }
}

.greeting-left {
  display: flex;
  flex: 2;
  align-items: center;
  gap: var(--l-spacing);
}

.greeting-right {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: var(--s-spacing);
}

.greeting-icon {
  font-size: 48px;
}

.greeting-title {
  font-weight: 800;
  color: var(--color-heading);

  @media (max-width: 1023px) {
    font-size: var(--l-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--xl-font-size);
  }
}

.greeting-sub {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  margin-top: var(--xxs-spacing);
}
</style>
