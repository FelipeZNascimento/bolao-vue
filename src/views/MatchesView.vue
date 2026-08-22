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
        v-show="activeProfile && !activeProfileActive && !isProfileLoading"
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
      <template v-else>
        <template v-if="finishedMatches.length">
          <div class="section-header">
            <i class="pi pi-flag" />
            Encerradas
          </div>
          <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
            <MatchComponent
              v-for="match in finishedMatches"
              :key="match.id"
              :isGridMode="view === 'grid'"
              :match="match"
            />
          </div>
        </template>
        <template v-if="liveMatches.length">
          <div class="section-header section-header--live">
            <i class="pi pi-circle-fill" />
            Ao vivo
          </div>
          <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
            <MatchComponent
              v-for="match in liveMatches"
              :key="match.id"
              :isGridMode="view === 'grid'"
              :match="match"
            />
          </div>
        </template>
        <template v-if="upcomingMatches.length">
          <div class="section-header">
            <i class="pi pi-clock" />
            Em breve
          </div>
          <div :class="{ 'outer-line-mode': view === 'lines', 'outer-grid-mode': view === 'grid' }">
            <MatchComponent
              v-for="match in upcomingMatches"
              :key="match.id"
              :isGridMode="view === 'grid'"
              :match="match"
            />
          </div>
        </template>
      </template>
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
import { FINISHED_GAME, MATCH_STATUS } from '@/constants/match_status';
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

const finishedMatches = computed(() =>
  matches.value.filter((m) => FINISHED_GAME.includes(m.status as (typeof FINISHED_GAME)[number]))
);
const liveMatches = computed(() =>
  matches.value.filter(
    (m) => m.status !== MATCH_STATUS.NOT_STARTED && !FINISHED_GAME.includes(m.status as (typeof FINISHED_GAME)[number])
  )
);
const upcomingMatches = computed(() => matches.value.filter((m) => m.status === MATCH_STATUS.NOT_STARTED));
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

.section-header {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  font-size: var(--m-font-size);
  font-weight: 700;
  width: 100%;
  padding: var(--s-spacing) 0;
  border-bottom: 1px solid var(--bolao-c-grey3);
  color: var(--color-text);

  &--live {
    color: var(--bolao-c-red);

    i {
      font-size: var(--xs-font-size);
      animation: pulse 1.2s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
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
