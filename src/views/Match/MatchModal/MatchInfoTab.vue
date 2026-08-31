<template>
  <div
    v-if="isLoading"
    class="tab-loading"
  >
    <PrimeProgressSpinner />
  </div>
  <div
    v-else-if="error"
    class="tab-error"
  >
    {{ error }}
  </div>
  <div
    v-else-if="summary"
    class="ficha-outer"
    :style="venueImage ? { backgroundImage: `url(${venueImage})` } : {}"
  >
    <div class="ficha-overlay">
      <div
        v-if="summary.gameInfo"
        class="venue-info"
      >
        <p class="venue-name">{{ summary.gameInfo.venue.fullName }}</p>
        <p
          v-if="summary.gameInfo.venue.address"
          class="venue-address"
        >
          {{ [summary.gameInfo.venue.address.city, summary.gameInfo.venue.address.state].filter(Boolean).join(', ') }}
        </p>
      </div>
      <div
        v-if="summary.gameInfo?.weather"
        class="weather-pills"
      >
        <span
          v-if="summary.gameInfo.weather.displayValue"
          class="weather-pill"
          >{{ summary.gameInfo.weather.displayValue }}</span
        >
        <span
          v-if="weatherTempC !== null"
          class="weather-pill"
          >🌡 {{ weatherTempC }}°C</span
        >
        <span
          v-if="weatherGustKmh !== null"
          class="weather-pill"
          >💨 {{ weatherGustKmh }} km/h</span
        >
        <span
          v-if="summary.gameInfo?.weather.humidity !== undefined"
          class="weather-pill"
          >💧 {{ summary.gameInfo.weather.humidity }}%</span
        >
      </div>
      <div
        v-if="summary.gameInfo?.attendance"
        class="ficha-section"
      >
        <p class="ficha-label">Público</p>
        <p>{{ summary.gameInfo.attendance.toLocaleString('pt-BR') }}</p>
      </div>
      <div
        v-if="summary.gameInfo?.officials?.length"
        class="ficha-section"
      >
        <p class="ficha-label">Árbitros</p>
        <p
          v-for="official in summary.gameInfo.officials"
          :key="official.order"
          class="ficha-sub"
        >
          {{ official.displayName }} — {{ official.position.displayName }}
        </p>
      </div>
    </div>
  </div>
  <div
    v-else
    class="tab-empty"
  >
    Sem informações disponíveis.
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { IMatchSummary } from '@/stores/matchSummary.type';

const props = defineProps<{
  error: string | null;
  isLoading: boolean;
  summary: IMatchSummary | null;
}>();

const venueImage = computed(() => props.summary?.gameInfo?.venue?.images?.[0]?.href ?? null);

const weatherTempC = computed(() => {
  const f = props.summary?.gameInfo?.weather?.temperature;
  if (f === undefined || f === null) return null;
  return Math.round(((f - 32) * 5) / 9);
});

const weatherGustKmh = computed(() => {
  const mph = props.summary?.gameInfo?.weather?.gust;
  if (mph === undefined || mph === null) return null;
  return Math.round(mph * 1.60934);
});
</script>
<style lang="scss" scoped>
.tab-loading {
  display: flex;
  justify-content: center;
  padding: var(--xl-spacing);
}

.tab-error,
.tab-empty {
  padding: var(--l-spacing);
  color: var(--bolao-c-grey3);
  text-align: center;
}

.ficha-outer {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-color: var(--bolao-c-grey6);
  position: relative;
}

.ficha-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%), rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--l-spacing);
  gap: var(--m-spacing);
  overflow-y: auto;
}

.ficha-section {
  display: flex;
  flex-direction: column;
  gap: var(--xxxs-spacing);

  @media (max-width: 1023px) {
    font-size: var(--xs-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--s-font-size);
  }
}

.venue-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.venue-name {
  font-weight: 700;
  color: var(--bolao-c-white);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: 1023px) {
    font-size: var(--xs-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--l-font-size);
  }
}

.venue-address {
  color: var(--bolao-c-grey1);

  @media (max-width: 1023px) {
    font-size: var(--xs-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--s-font-size);
  }
}

.weather-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--xs-spacing);
}

.weather-pill {
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  border-radius: 999px;
  padding: 2px var(--s-spacing);
  white-space: nowrap;
}

.ficha-label {
  font-weight: 700;
  text-transform: uppercase;
  color: var(--bolao-c-grey2);

  @media (max-width: 1023px) {
    font-size: var(--xs-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--s-font-size);
  }
}

.ficha-sub {
  color: var(--bolao-c-grey2);

  @media (max-width: 1023px) {
    font-size: var(--xs-font-size);
  }
  @media (min-width: 1024px) {
    font-size: var(--s-font-size);
  }
}
</style>
