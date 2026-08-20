<template>
  <div class="outer-results">
    <div class="outer-matches">
      <PrimeMessage
        v-show="errorConfiguration"
        class="notification-message"
        severity="error"
        variant="outlined"
      >
        Ops, houve um problema de comunicação com o servidor.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
          administradores do Bolão.
        </p>
        <p>{{ errorConfiguration?.message }}</p>
      </PrimeMessage>
      <PaginatorComponent />
      <PrimeMessage
        v-show="!activeProfileActive && !isProfileLoading"
        class="notification-message"
        severity="warn"
      >
        <!-- variant="outlined" -->
        Sua inscrição para a temporada atual ainda não está ativa.
        <p v-if="activeProfile && activeProfile.seasonId !== currentSeason">
          <span
            class="register-link"
            @click="openSeasonRegisterModal()"
            >Registre-se na atual temporada</span
          >
          e efetue o pagamento para participar do Bolão.
        </p>
        <p v-else>Assim que confirmarmos seu pagamento, sua conta será liberada!</p>
        <p><RouterLink to="/regras">Ver regras.</RouterLink></p>
      </PrimeMessage>
      <PrimeMessage
        v-show="errorMatches"
        class="notification-message"
        severity="error"
        variant="outlined"
      >
        Ops, houve um problema de comunicação com o servidor para buscar as partidas.
        <p>
          Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
          administradores do Bolão.
        </p>
        <p>{{ errorMatches?.message }}</p>
      </PrimeMessage>
      <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
        <span
          :class="{
            'outer-skeleton-line': view === 'lines',
            'outer-skeleton-grid': view === 'grid'
          }"
          v-if="isLoading"
        >
          <PrimeSkeleton
            v-for="index in 16"
            :key="index"
            :class="{
              'skeleton-match-line': view === 'lines',
              'skeleton-match-grid': view === 'grid'
            }"
          />
        </span>
        <MatchComponent
          v-else
          v-for="match in matches"
          :isGridMode="view === 'grid'"
          :match="match"
          :key="match.id"
        />
      </div>
    </div>
    <RankingComponent
      v-if="isDesktop && rankingPosition === 'active'"
      mode="compact"
    />
  </div>
</template>
<script setup lang="ts">
import { isDesktop } from '@basitcodeenv/vue3-device-detect';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import MatchComponent from '@/components/Match/MatchComponent.vue';
import PaginatorComponent from '@/components/PaginatorComponent.vue';
import RankingComponent from '@/components/Ranking/RankingComponent.vue';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

const {
  isLoading: isConfigurationLoading,
  currentSeason,
  rankingPosition,
  error: errorConfiguration,
  resultsView: view
} = storeToRefs(useConfigurationStore());
const { isLoading: isMatchesLoading, matches, error: errorMatches } = storeToRefs(useMatchesStore());
const isLoading = computed(() => isConfigurationLoading.value || isMatchesLoading.value);
const activeProfileStore = useActiveProfileStore();
const { activeProfile, isLoading: isProfileLoading } = storeToRefs(activeProfileStore);
const { openSeasonRegisterModal } = activeProfileStore;

const activeProfileActive = computed(
  () => activeProfile.value?.active && activeProfile.value.seasonId === currentSeason.value
);
</script>
<style scoped>
.outer-results {
  display: flex;
}

.outer-matches {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--m-spacing);
  flex: 1;

  @media (min-width: 1024px) {
    padding-right: var(--m-spacing);
  }
}

.outer-line-mode {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--s-spacing);
  width: 100%;
}

.outer-grid-mode {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 1023px) {
    gap: var(--m-spacing);
  }

  @media (min-width: 1024px) {
    gap: var(--xl-spacing);
  }
}

.notification-message {
  align-self: center;
  text-align: center;
  margin: var(--xl-spacing) 0;
}

.register-link {
  cursor: pointer;
  text-decoration: underline;
}

.outer-skeleton-line {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.outer-skeleton-grid {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  align-items: flex-start;
  justify-content: center;
}

.skeleton-match-line {
  height: 60px !important;
  width: 100% !important;
}

.skeleton-match-grid {
  height: 150px !important;

  @media (max-width: 1023px) {
    width: 170px !important;
  }

  @media (min-width: 1024px) {
    width: 250px !important;
  }
}
</style>
