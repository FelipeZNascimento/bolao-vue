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
    class="drives-outer"
  >
    <div class="drives-toggle">
      <PrimeSelectButton
        v-model="drivesView"
        :options="drivesOptions"
        optionLabel="label"
      />
    </div>
    <div
      v-if="drivesView.value === 'scoring'"
      class="drives-list"
    >
      <div
        v-if="!summary.scoringPlays?.length"
        class="tab-empty"
      >
        Nenhum scoring play.
      </div>
      <div
        v-for="play in summary.scoringPlays"
        :key="play.id"
        class="drive-item"
        :class="{ 'drive-item--home': isHome(play.team.abbreviation) }"
        :style="{ borderColor: teamColors(play.team.abbreviation).background }"
      >
        <span
          v-if="!isMobile"
          class="drive-team"
          :style="{
            backgroundColor: teamColors(play.team.abbreviation).background,
            color: teamColors(play.team.abbreviation).foreground
          }"
        >
          {{ play.team.abbreviation }}
        </span>
        <span class="drive-text">{{ play.text }}</span>
        <span class="drive-meta">Q{{ play.period.number }} — {{ play.clock.displayValue }}</span>
        <span class="drive-score">{{ play.awayScore }} – {{ play.homeScore }}</span>
      </div>
    </div>
    <div
      v-else
      class="drives-list"
    >
      <div
        v-if="!allDrives.length"
        class="tab-empty"
      >
        Nenhum drive registrado.
      </div>
      <div
        v-for="drive in allDrives"
        :key="drive.id"
        class="drive-item"
        :class="{ 'drive-item--home': isHome(drive.team.abbreviation) }"
        :style="{ borderColor: teamColors(drive.team.abbreviation).background }"
      >
        <span
          v-if="!isMobile"
          class="drive-team"
          :style="{
            backgroundColor: teamColors(drive.team.abbreviation).background,
            color: teamColors(drive.team.abbreviation).foreground
          }"
        >
          {{ drive.team.abbreviation }}
        </span>
        <span class="drive-text">{{ drive.description }}</span>
      </div>
    </div>
  </div>
  <div
    v-else
    class="tab-empty"
  >
    Sem drives disponíveis.
  </div>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';
import { computed, ref } from 'vue';
import type { ITeam } from '@/stores/matches.types';
import type { IMatchSummary } from '@/stores/matchSummary.type';

const { error, isLoading, summary, homeTeam, awayTeam } = defineProps<{
  error: string | null;
  isLoading: boolean;
  summary: IMatchSummary | null;
  homeTeam: ITeam;
  awayTeam: ITeam;
}>();

const drivesOptions = [
  { label: 'Scoring Plays', value: 'scoring' as const },
  { label: 'Todos os Drives', value: 'all' as const }
];

const drivesView = ref(drivesOptions[0]);

const allDrives = computed(() => summary?.drives ?? []);

function isHome(abbreviation: string): boolean {
  return abbreviation === homeTeam.code;
}

function teamColors(abbreviation: string): { background: string; foreground: string } {
  const team = isHome(abbreviation) ? homeTeam : awayTeam;
  return { background: team.background, foreground: team.foreground };
}
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

.drives-outer {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  padding: var(--l-spacing);
}

.drives-toggle {
  display: flex;
  justify-content: center;
}

.drives-list {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
}

.drive-item {
  display: flex;
  flex-direction: row;
  gap: var(--s-spacing);
  align-items: center;
  padding: var(--s-spacing) var(--m-spacing);
  border-radius: var(--border-radius);
  background: var(--bolao-c-grey6);
  border-left: 3px solid transparent;

  &--home {
    flex-direction: row-reverse;
    border-left: none;
    border-right: 3px solid transparent;
    text-align: right;
  }
}

.drive-team {
  font-weight: 700;
  font-size: var(--xs-font-size);
  min-width: 2.5rem;
  text-align: center;
  padding: 2px var(--xs-spacing);
  border-radius: var(--border-radius);
}

.drive-text {
  font-size: var(--s-font-size);
}

.drive-meta {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
  white-space: nowrap;
}

.drive-score {
  font-weight: 700;
  font-size: var(--s-font-size);
  white-space: nowrap;
}
</style>
