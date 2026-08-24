<template>
  <div class="scores-view">
    <!-- Loading -->
    <div
      v-if="isLoading"
      class="state-message"
    >
      <i class="pi pi-spinner pi-spin" />
      Carregando placares...
    </div>

    <!-- Unlinked -->
    <div
      v-else-if="!isLinked"
      class="state-message"
    >
      <i class="pi pi-link-slash" />
      Nenhuma conta Fleaflicker vinculada. Acesse a aba
      <RouterLink
        :to="{ path: '/fleaflicker', query: { tab: 'config' } }"
        style="font-weight: bold"
      >
        Config
      </RouterLink>
      para conectar.
    </div>

    <!-- Error -->
    <PrimeMessage
      v-else-if="error"
      severity="error"
      variant="outlined"
    >
      {{ error }}
    </PrimeMessage>

    <!-- Data -->
    <template v-else-if="scoreboard">
      <div class="scores-header">
        <div class="week-picker">
          <i
            v-if="isLoading"
            class="pi pi-spinner pi-spin"
          />
          <select
            :value="scoreboard.schedulePeriod.value"
            class="week-select"
            @change="emit('fetch-week', +($event.target as HTMLSelectElement).value)"
          >
            <option
              v-for="period in scoreboard.eligibleSchedulePeriods"
              :key="period.value"
              :value="period.value"
            >
              Semana {{ period.value }}
            </option>
          </select>
        </div>
      </div>

      <div class="matchups">
        <div
          v-for="game in scoreboard.games"
          :key="game.id"
          class="matchup-card"
          :class="{ 'matchup-card--divisional': game.isDivisional }"
        >
          <!-- Away row -->
          <div class="team-row">
            <RouterLink
              :to="{ path: '/fleaflicker', query: { tab: 'roster', teamId: game.away.id } }"
              class="team-link"
            >
              <img
                v-if="game.away.logoUrl"
                :src="game.away.logoUrl"
                :alt="game.away.name"
                class="team-logo"
              />
              <span
                v-else
                class="team-initials"
                >{{ game.away.initials }}</span
              >
              <span class="team-name">{{ game.away.name }}</span>
            </RouterLink>
            <div class="team-score">
              <span class="score-actual">{{ game.awayScore.score.formatted }}</span>
              <span
                v-if="game.awayScore.projected"
                class="score-projected"
              >
                proj. {{ game.awayScore.projected.formatted }}
              </span>
              <span
                v-else
                class="score-projected"
              >
                proj. -
              </span>
              <span
                v-if="game.awayScore.yetToPlay != null"
                class="yet-to-play"
              >
                {{ game.awayScore.yetToPlay }} por jogar
              </span>
              <span
                v-else
                class="yet-to-play"
              >
                -
              </span>
            </div>
          </div>

          <!-- Home row -->
          <div class="team-row">
            <RouterLink
              :to="{ path: '/fleaflicker', query: { tab: 'roster', teamId: game.home.id } }"
              class="team-link"
            >
              <img
                v-if="game.home.logoUrl"
                :src="game.home.logoUrl"
                :alt="game.home.name"
                class="team-logo"
              />
              <span
                v-else
                class="team-initials"
                >{{ game.home.initials }}</span
              >
              <span class="team-name">{{ game.home.name }}</span>
            </RouterLink>
            <div class="team-score">
              <span class="score-actual">{{ game.homeScore.score.formatted }}</span>
              <span
                v-if="game.homeScore.projected"
                class="score-projected"
              >
                proj. {{ game.homeScore.projected.formatted }}
              </span>
              <span
                v-else
                class="score-projected"
              >
                proj. -
              </span>

              <span
                v-if="game.homeScore.yetToPlay != null"
                class="yet-to-play"
              >
                {{ game.homeScore.yetToPlay }} por jogar
              </span>
              <span
                v-else
                class="yet-to-play"
              >
                -
              </span>
            </div>
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <span
              v-if="game.isDivisional"
              class="divisional-badge"
            >
              <i class="pi pi-shield" /> Divisional
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { IFleaflickerScoreboard } from '@/stores/fleaflicker.types';

const props = defineProps<{
  scoreboard: IFleaflickerScoreboard | null;
  isLoading: boolean;
  isLinked: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: 'fetch-week', week: number): void;
}>();
</script>
<style scoped>
.scores-view {
  display: flex;
  flex-direction: column;
  gap: var(--xl-spacing);
}

.state-message {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--xl-spacing);
  justify-content: center;
  color: var(--bolao-c-grey4);
}

.scores-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--m-spacing);
}

.week-label {
  font-size: var(--l-font-size);
  font-weight: 600;
  color: light-dark(var(--bolao-c-grey5), var(--bolao-c-grey3));
}

.week-picker {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.week-select {
  padding: var(--xs-spacing) var(--s-spacing);
  border-radius: var(--s-border-radius);
  border: 1px solid light-dark(var(--bolao-c-grey2), var(--bolao-c-grey5));
  background: light-dark(var(--bolao-c-white), var(--bolao-c-navy));
  color: inherit;
  font-size: var(--s-font-size);
  cursor: pointer;

  &:focus {
    outline: 2px solid var(--p-primary-color);
    outline-offset: 1px;
  }
}

.matchups {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-spacing);

  @media (max-width: 1024px) {
    justify-content: center;
  }
}

.matchup-card {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--m-spacing);
  border-radius: var(--m-border-radius);
  width: 300px;
  border: 1px solid light-dark(var(--bolao-c-grey2), var(--bolao-c-grey5));
  background: var(--bolao-c-navy);

  &.matchup-card--divisional {
    border-color: color-mix(in srgb, var(--bolao-c-gold) 40%, transparent);
  }
}

.team-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-spacing);
}

.team-link {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  text-decoration: none;
  color: inherit;
  min-width: 0;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
}

.team-logo {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  object-fit: contain;
  border-radius: 50%;
}

.team-initials {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bolao-c-grey5);
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 700;
}

.team-name {
  font-weight: 600;
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.score-actual {
  font-size: var(--m-font-size);
  font-weight: 700;
  color: var(--bolao-c-white);
  line-height: 1.2;
}

.score-projected {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-mint);
  line-height: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  margin-top: var(--xxs-spacing);
  padding-top: var(--xs-spacing);
  border-top: 1px solid light-dark(var(--bolao-c-grey2), var(--bolao-c-grey5));
}

.yet-to-play {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  line-height: 1;
}

.divisional-badge {
  margin-left: auto;
  font-size: 0.65rem;
  color: var(--bolao-c-gold);
  display: flex;
  align-items: center;
  gap: 0.2rem;
  opacity: 0.85;
}
</style>
