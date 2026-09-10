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
    v-else-if="allDrives.length"
    class="drives-outer"
  >
    <div
      v-for="drive in allDrives"
      :key="drive.id"
      class="drive-card"
    >
      <!-- ── Header (always visible) ── -->
      <div
        class="drive-header"
        :style="{
          borderLeftColor: teamColors(drive.team.abbreviation).background
        }"
        @click="toggleDrive(drive.id)"
      >
        <span
          class="drive-team-chip"
          :style="{
            backgroundColor: teamColors(drive.team.abbreviation).background,
            color: teamColors(drive.team.abbreviation).foreground
          }"
        >
          {{ drive.team.abbreviation }}
        </span>

        <div class="drive-header-body">
          <span class="drive-description">{{ drive.description }}</span>
          <div class="drive-header-meta">
            <span class="drive-meta-item"> <i class="pi pi-clock" /> {{ drive.timeElapsed.displayValue }} </span>
            <span class="drive-meta-item">
              Q{{ drive.start.period.number }} — {{ drive.start.clock.displayValue }}
            </span>
          </div>
        </div>

        <span
          class="drive-result-badge"
          :class="resultClass(drive.result)"
        >
          {{ drive.shortDisplayResult }}
        </span>

        <i
          class="pi drive-chevron"
          :class="expandedDrives.has(drive.id) ? 'pi-chevron-up' : 'pi-chevron-down'"
        />
      </div>

      <!-- ── Play-by-play (expandable) ── -->
      <div
        v-if="expandedDrives.has(drive.id)"
        class="drive-plays"
      >
        <div
          v-if="!drive.plays.length"
          class="plays-empty"
        >
          Sem detalhes disponíveis.
        </div>
        <div
          v-for="(play, i) in drive.plays"
          :key="i"
          class="play-row"
          :class="{ 'play-row--turnover': play.isTurnover, 'play-row--penalty': play.isPenalty }"
        >
          <span class="play-type-pill">{{ play.type.abbreviation || play.type.text }}</span>
          <span class="play-text">{{ play.text }}</span>
          <span class="play-flags">
            <i
              v-if="play.isPenalty"
              class="pi pi-flag play-flag"
              v-tooltip.top="'Flag'"
            />
            <i
              v-if="play.isTurnover"
              class="pi pi-times-circle play-turnover"
              v-tooltip.top="'Turnover'"
            />
          </span>
          <span class="play-score">{{ play.awayScore }} – {{ play.homeScore }}</span>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else-if="!isLoading"
    class="tab-empty"
  >
    Sem drives disponíveis.
  </div>
</template>

<script setup lang="ts">
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

const expandedDrives = ref<Set<string>>(new Set());

const allDrives = computed(() => summary?.drives ?? []);

function toggleDrive(id: string) {
  if (expandedDrives.value.has(id)) {
    expandedDrives.value.delete(id);
  } else {
    expandedDrives.value.add(id);
  }
  // Trigger reactivity on the Set
  expandedDrives.value = new Set(expandedDrives.value);
}

function isHome(abbreviation: string): boolean {
  return abbreviation === homeTeam.code;
}

function teamColors(abbreviation: string): { background: string; foreground: string } {
  const team = isHome(abbreviation) ? homeTeam : awayTeam;
  return { background: team.background, foreground: team.foreground };
}

function resultClass(result: string): string {
  const r = result?.toUpperCase() ?? '';
  if (r === 'TD') return 'result--td';
  if (r === 'FG') return 'result--fg';
  if (r === 'INT' || r === 'FUMB' || r === 'FUMBLE' || r === 'DOWNS') return 'result--turnover';
  return 'result--neutral';
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

// ── Drive cards ────────────────────────────────────────────────────────────────

.drives-outer {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--m-spacing);
}

.drive-card {
  border-radius: var(--p-border-radius-md);
  overflow: hidden;
  border: 1px solid var(--p-surface-border);
}

.drive-header {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--s-spacing) var(--m-spacing);
  border-left: 3px solid transparent;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;

  &:hover {
    background: light-dark(var(--bolao-c-black-t3), var(--bolao-c-grey4-t1));
  }
}

.drive-team-chip {
  flex-shrink: 0;
  font-weight: 700;
  font-size: var(--xs-font-size);
  padding: 2px var(--s-spacing);
  border-radius: var(--p-border-radius-sm);
  min-width: 2.5rem;
  text-align: center;
}

.drive-header-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drive-description {
  font-size: var(--s-font-size);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drive-header-meta {
  display: flex;
  gap: var(--m-spacing);
  font-size: var(--xs-font-size);
  color: var(--p-text-muted-color);

  .pi {
    font-size: var(--xs-font-size);
  }
}

.drive-meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
}

.drive-result-badge {
  flex-shrink: 0;
  font-size: var(--xs-font-size);
  font-weight: 700;
  padding: 2px var(--s-spacing);
  border-radius: var(--p-border-radius-sm);

  &.result--td {
    background: var(--bolao-c-green-t1);
    color: var(--bolao-c-mint);
  }

  &.result--fg {
    background: var(--bolao-c-blue-t1);
    color: var(--bolao-c-blue);
  }

  &.result--turnover {
    background: var(--bolao-c-red-t1);
    color: var(--bolao-c-red);
  }

  &.result--neutral {
    background: light-dark(var(--bolao-c-black-t3), var(--bolao-c-grey4-t1));
    color: var(--p-text-muted-color);
  }
}

.drive-chevron {
  flex-shrink: 0;
  font-size: var(--xs-font-size);
  color: var(--p-text-muted-color);
}

// ── Play rows ──────────────────────────────────────────────────────────────────

.drive-plays {
  border-top: 1px solid var(--p-surface-border);
}

.plays-empty {
  padding: var(--s-spacing) var(--m-spacing);
  color: var(--p-text-muted-color);
  font-size: var(--xs-font-size);
}

.play-row {
  display: flex;
  align-items: baseline;
  gap: var(--s-spacing);
  padding: var(--xs-spacing) var(--m-spacing);
  border-bottom: 1px solid var(--p-surface-border);
  font-size: var(--xs-font-size);

  &:last-child {
    border-bottom: none;
  }

  &--turnover {
    background: var(--bolao-c-red-t1);
  }

  &--penalty {
    background: light-dark(#fff8e1, #2a2000);
  }
}

.play-type-pill {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: var(--p-border-radius-sm);
  background: light-dark(var(--bolao-c-black-t3), var(--bolao-c-grey4-t1));
  color: var(--p-text-muted-color);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.play-text {
  flex: 1;
  min-width: 0;
  line-height: 1.4;
}

.play-flags {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.play-flag {
  color: #f5a623;
}

.play-turnover {
  color: var(--bolao-c-red);
}

.play-score {
  flex-shrink: 0;
  font-weight: 700;
  white-space: nowrap;
  color: var(--p-text-muted-color);
}
</style>
