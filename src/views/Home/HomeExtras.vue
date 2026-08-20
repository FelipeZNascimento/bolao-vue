<template>
  <section class="dashboard-section">
    <div class="section-header">
      <h2 class="section-title">Extras</h2>
      <RouterLink
        to="/extras"
        class="section-link"
        >Ver detalhes →</RouterLink
      >
    </div>

    <div
      class="extras-card"
      :class="{ 'extras-card--complete': missingCount === 0 }"
    >
      <!-- Completion banner -->
      <div
        v-if="missingCount === 0"
        class="extras-complete-banner"
      >
        <span class="extras-complete-icon">🏆</span>
        <div>
          <p class="extras-complete-title">Tudo pronto!</p>
          <p class="extras-complete-sub">Você completou todas as apostas extras. Boa sorte na temporada!</p>
        </div>
      </div>

      <!-- Bet status -->
      <div class="extras-stats">
        <div class="extras-stat extras-stat--placed">
          <span class="extras-stat-value">{{ placedCount }}</span>
          <span class="extras-stat-label">apostas feitas</span>
        </div>
        <div
          v-if="isDesktop"
          class="extras-stat-divider"
        />
        <div
          class="extras-stat extras-stat--missing"
          :class="{ 'extras-stat--ok': missingCount === 0 }"
        >
          <span class="extras-stat-value">{{ missingCount }}</span>
          <span class="extras-stat-label">{{ missingCount === 1 ? 'aposta faltando' : 'apostas faltando' }}</span>
        </div>
        <div
          v-if="isDesktop"
          class="extras-stat-divider"
        />
        <div class="extras-stat">
          <span class="extras-stat-value">{{ TOTAL_BETS }}</span>
          <span class="extras-stat-label">total de apostas</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="extras-progress-track">
        <div
          class="extras-progress-fill"
          :class="{ 'extras-progress-fill--complete': missingCount === 0 }"
          :style="{ width: progressPct + '%' }"
        />
      </div>
      <p class="extras-progress-label">{{ progressPct }}% completo</p>

      <!-- Countdown -->
      <div
        v-if="seasonStart"
        class="extras-countdown"
      >
        <template>
          <span class="countdown-label">Temporada começa em</span>
          <div class="countdown-blocks">
            <div class="countdown-block">
              <span class="countdown-value">{{ countdownDays }}</span>
              <span class="countdown-unit">dias</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-block">
              <span class="countdown-value">{{ countdownHours }}</span>
              <span class="countdown-unit">horas</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-block">
              <span class="countdown-value">{{ countdownMinutes }}</span>
              <span class="countdown-unit">min</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-block">
              <span class="countdown-value">{{ countdownSeconds }}</span>
              <span class="countdown-unit">seg</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { isDesktop } from '@basitcodeenv/vue3-device-detect';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { EXTRA_BETS_VALUES } from '@/constants/bets';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';

// 11 single-team categories + 3 AFC wildcards + 3 NFC wildcards = 17 slots
const WILDCARD_SLOTS = 3;
const TOTAL_BETS =
  Object.keys(EXTRA_BETS_VALUES).length -
  2 + // non-wildcard categories
  WILDCARD_SLOTS * 2; // AFC + NFC wildcards

const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const extraBetStore = useExtraBetStore();

const { loggedUserBets } = storeToRefs(extraBetStore);
const { seasonStart } = storeToRefs(configurationStore);
const { currentTimestamp } = storeToRefs(clockStore);

// Count team slots: wildcards contribute their actual team count, others contribute 1 each
const placedCount = computed(() => {
  const bets = loggedUserBets.value?.bets ?? [];
  return bets.reduce((sum, bet) => sum + bet.teams.length, 0);
});
const missingCount = computed(() => Math.max(0, TOTAL_BETS - placedCount.value));
const progressPct = computed(() => Math.round((placedCount.value / TOTAL_BETS) * 100));

// Countdown — driven by the shared clock store tick
const countdownMs = computed(() => {
  if (!seasonStart.value) return 0;
  return Math.max(0, seasonStart.value - currentTimestamp.value) * 1000;
});

const countdownDays = computed(() => String(Math.floor(countdownMs.value / 86_400_000)).padStart(2, '0'));
const countdownHours = computed(() =>
  String(Math.floor((countdownMs.value % 86_400_000) / 3_600_000)).padStart(2, '0')
);
const countdownMinutes = computed(() => String(Math.floor((countdownMs.value % 3_600_000) / 60_000)).padStart(2, '0'));
const countdownSeconds = computed(() => String(Math.floor((countdownMs.value % 60_000) / 1_000)).padStart(2, '0'));
</script>

<style lang="scss" scoped>
.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--m-spacing);
}

.section-title {
  font-size: var(--l-font-size);
  font-weight: 700;
  color: var(--color-heading);
}

.section-link {
  font-size: var(--s-font-size);
  color: var(--bolao-c-sky);
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
}

.extras-card {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  padding: var(--l-spacing) var(--xl-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  transition: border-color 0.4s ease;

  &--complete {
    border-color: var(--bolao-c-green, #4caf50);
  }
}

.extras-complete-banner {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
  padding: var(--s-spacing) var(--m-spacing);
  background: color-mix(in srgb, var(--bolao-c-green, #4caf50) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--bolao-c-green, #4caf50) 40%, transparent);
  border-radius: 4px;
}

.extras-complete-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.extras-complete-title {
  font-size: var(--m-font-size);
  font-weight: 700;
  color: var(--bolao-c-green, #4caf50);
}

.extras-complete-sub {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  margin-top: 2px;
}

.extras-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--l-spacing);
  flex-wrap: wrap;
}

.extras-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  &--placed .extras-stat-value {
    color: var(--bolao-c-sky);
  }

  &--missing .extras-stat-value {
    color: var(--bolao-c-red, #e05c5c);
  }

  &--ok .extras-stat-value {
    color: var(--bolao-c-green, #4caf50);
  }
}

.extras-stat-value {
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1;

  @media (max-width: 1023px) {
    font-size: var(--l-font-size);
  }

  @media (min-width: 1024px) {
    font-size: var(--xxl-font-size);
  }
}

.extras-stat-label {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.extras-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--bolao-c-grey2-t1);
  flex-shrink: 0;
}

.extras-progress-track {
  height: 6px;
  background: var(--bolao-c-grey2-t1);
  border-radius: 3px;
  overflow: hidden;
}

.extras-progress-fill {
  height: 100%;
  background: var(--bolao-c-sky);
  border-radius: 3px;
  transition:
    width 0.4s ease,
    background 0.4s ease;

  &--complete {
    background: var(--bolao-c-green, #4caf50);
  }
}

.extras-progress-label {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
}

.extras-countdown {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  padding-top: var(--m-spacing);
  border-top: 1px solid var(--bolao-c-grey2-t1);
}

.countdown-label {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.countdown-blocks {
  display: flex;
  align-items: center;
  gap: var(--xs-spacing);
}

.countdown-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 52px;
  padding: var(--xs-spacing) var(--s-spacing);
  background: var(--color-background-mute, var(--color-background));
  border: 1px solid var(--bolao-c-grey2-t1);
  border-radius: 4px;
}

.countdown-value {
  font-size: var(--xl-font-size);
  font-weight: 800;
  color: var(--color-heading);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.countdown-unit {
  font-size: var(--xxs-font-size);
  color: var(--bolao-c-grey4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.countdown-sep {
  font-size: var(--xl-font-size);
  font-weight: 700;
  color: var(--bolao-c-grey4);
  line-height: 1;
  margin-bottom: 12px;
}

.countdown-started {
  font-size: var(--m-font-size);
  font-weight: 600;
  color: var(--color-heading);
}
</style>
