<template>
  <PrimeDataTable
    :value="slots"
    stripedRows
    size="small"
    rowHover
    :rowClass="rowClass"
  >
    <PrimeColumn
      field="positionOrder"
      style="text-align: center"
      sortable
    >
      <template #header>
        <span style="width: 100%; text-align: center">Pos</span>
      </template>

      <template #body="{ data }">
        <span style="display: inline-flex; align-items: center; gap: 3px">
          <span
            v-if="activeGame(data)?.isProjectedStarter"
            class="projected-star"
            v-tooltip.top="'Provável titular'"
          >
            ★
          </span>
          {{ data.leaguePlayer?.proPlayer.position ?? '—' }}
        </span>
      </template>
    </PrimeColumn>

    <PrimeColumn
      field="slotOrder"
      style="text-align: center"
      sortable
    >
      <template #header>
        <span style="width: 100%; text-align: center">Escalação</span>
      </template>
      <template #body="{ data }">
        {{ data.slotLabel }}
      </template>
    </PrimeColumn>
    <PrimeColumn
      header="Jogador"
      field="leaguePlayer.proPlayer.nameFull"
      sortable
    >
      <template #body="{ data }">
        <div
          v-if="data.leaguePlayer"
          class="list-player-cell"
        >
          <span class="list-headshot-wrap">
            <img
              v-if="data.leaguePlayer.proPlayer.headshotUrl && !tableImgErrors[data.leaguePlayer.proPlayer.id]"
              :src="data.leaguePlayer.proPlayer.headshotUrl"
              :alt="data.leaguePlayer.proPlayer.nameFull"
              class="list-headshot"
              @error="tableImgErrors[data.leaguePlayer.proPlayer.id] = true"
            />
            <i
              v-else
              class="pi pi-user list-headshot-fallback"
            />
          </span>
          <img
            v-if="activeGame(data)?.hasPossession"
            src="/src/img/football.png"
            class="possession-ball"
            alt="possession"
          />
          <span
            v-if="data.leaguePlayer?.proPlayer.injury"
            class="list-injury"
            v-tooltip.top="data.leaguePlayer.proPlayer.injury.typeFull"
          >
            {{ data.leaguePlayer.proPlayer.injury.typeAbbreviaition }}
          </span>
          <span>{{ data.leaguePlayer.proPlayer.nameFull }}</span>
          <button
            v-if="data.leaguePlayer.proPlayer.news?.length"
            class="list-news-btn"
            v-tooltip.top="{
              value: data.leaguePlayer.proPlayer.news[0].title,
              disabled: isMobile
            }"
            @click="openModal(EModal.PlayerNews, data.leaguePlayer.proPlayer.news)"
            :aria-label="`Notícias de ${data.leaguePlayer.proPlayer.nameFull}`"
          >
            <i class="pi pi-file" />
          </button>
        </div>
        <span
          v-else
          class="list-empty"
          >—</span
        >
      </template>
    </PrimeColumn>
    <PrimeColumn
      field="leaguePlayer.proPlayer.proTeamAbbreviation"
      style="text-align: center"
      sortable
    >
      <template #header>
        <span style="width: 100%; text-align: center">Equipe</span>
      </template>
      <template #body="{ data }">
        <span
          v-if="data.leaguePlayer"
          class="matchup-cell"
        >
          <span
            class="team-pill"
            :style="teamPillStyle(data.leaguePlayer.proPlayer.proTeamAbbreviation)"
          >
            {{ data.leaguePlayer.proPlayer.proTeamAbbreviation }}
          </span>
        </span>
      </template>
    </PrimeColumn>
    <PrimeColumn
      field="leaguePlayer.proPlayer.nflByeWeek"
      style="text-align: center"
      sortable
    >
      <template #header>
        <span style="width: 100%; text-align: center"><i class="pi pi-moon" /> Bye</span>
      </template>
      <template #body="{ data }">
        <span
          v-if="data.leaguePlayer?.proPlayer.nflByeWeek"
          style="margin-left: var(--s-spacing); font-size: var(--xs-font-size)"
        >
          {{ data.leaguePlayer.proPlayer.nflByeWeek }}
        </span>
      </template>
    </PrimeColumn>
    <PrimeColumn
      field="leaguePlayer.viewingProjectedPoints.formatted"
      style="text-align: center"
      sortable
    >
      <template #header>
        <span style="width: 100%; text-align: center">Pts Proj.</span>
      </template>

      <template #body="{ data }">
        <button
          v-if="data.leaguePlayer?.viewingProjectedPoints || activeGame(data)?.pointsActual"
          class="list-proj-btn"
          v-tooltip.top="{
            value: statsTooltip(data),
            disabled: isMobile
          }"
          @click="openModal(EModal.ProjectedStats, [data.leaguePlayer])"
          :aria-label="`Estatísticas de ${data.leaguePlayer?.proPlayer.nameFull}`"
        >
          <template v-if="activeGame(data)?.pointsActual">
            <span class="pts-actual">{{ activeGame(data)!.pointsActual!.formatted }}</span>
            <span
              v-if="data.leaguePlayer?.viewingProjectedPoints"
              class="pts-sep"
              >/</span
            >
            <span
              v-if="data.leaguePlayer?.viewingProjectedPoints"
              class="pts-proj"
              >{{ data.leaguePlayer.viewingProjectedPoints.formatted }}</span
            >
          </template>
          <template v-else>
            {{ data.leaguePlayer?.viewingProjectedPoints?.formatted }}
          </template>
        </button>
        <template v-if="adversaryTeam(data)">
          <span class="matchup-sep">vs</span>
          <span
            class="team-pill"
            :style="teamPillStyle(adversaryTeam(data)!.abbreviation)"
          >
            {{ adversaryTeam(data)!.abbreviation }}
          </span>
        </template>
      </template>
    </PrimeColumn>
  </PrimeDataTable>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import type { IFleaflickerFlatSlot, IFleaflickerRequestedGame, IFleaflickerTeam } from '@/stores/fleaflicker.types';
import { EModal, useModalsStore } from '@/stores/modals';
import { useTeamsStore } from '@/stores/teams';

defineProps<{ slots: IFleaflickerFlatSlot[] }>();

const isMobile = window.matchMedia('(max-width: 768px)').matches;
const { openModal } = useModalsStore();

function activeGame(slot: IFleaflickerFlatSlot): IFleaflickerRequestedGame | null {
  const games = slot.leaguePlayer?.requestedGames;
  if (!games?.length) return null;
  return games.find((g) => g.hasPossession) ?? games[0];
}

function rowClass(slot: IFleaflickerFlatSlot): string {
  const g = activeGame(slot);
  if (g?.inScoringPosition) return 'row--scoring';
  if (g?.hasPossession) return 'row--possession';
  return '';
}

function adversaryTeam(slot: IFleaflickerFlatSlot): IFleaflickerTeam | null {
  const g = activeGame(slot);
  if (!g) return null;
  return g.participant === 'HOME' ? g.game.away : g.game.home;
}

function statsTooltip(slot: IFleaflickerFlatSlot): string {
  const parts: string[] = [];
  const g = activeGame(slot);
  if (g?.pointsActual) {
    const actual = g.stats.map((s) => `${s.category.abbreviation}: ${s.value.formatted}`).join(' · ');
    parts.push(`Real: ${actual}`);
  }
  const proj = slot.leaguePlayer?.viewingProjectedStats;
  if (proj?.length) {
    parts.push(`Proj.: ${proj.map((s) => `${s.category.abbreviation}: ${s.value.formatted}`).join(' · ')}`);
  }
  return parts.join('\n');
}

const { teams } = useTeamsStore();

function teamPillStyle(abbr: string): Record<string, string> {
  const team = teams.find((t) => t.code === abbr);
  if (!team) return {};
  return {
    backgroundColor: `${team.background}`,
    color: `${team.foreground}`
  };
}

const tableImgErrors = reactive<Record<number, boolean>>({});
</script>
<style scoped>
.list-player-cell {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.possession-ball {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.projected-star {
  color: var(--bolao-c-gold);
  font-size: 0.6rem;
  cursor: default;
  line-height: 1;
}

.list-headshot-wrap {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bolao-c-grey5);
  overflow: hidden;
}

.list-headshot {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 50%;
}

.list-headshot-fallback {
  font-size: 0.85rem;
  color: var(--bolao-c-grey3);
}

.list-injury {
  color: var(--bolao-c-gold);
  font-weight: bold;
  cursor: default;
}

.list-points {
  color: var(--bolao-c-mint);
}

.list-news-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--bolao-c-grey3);
  padding: 2px;
  line-height: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: var(--p-primary-color);
  }

  .pi {
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    color: var(--p-primary-color);
    background-color: color-mix(in srgb, var(--p-primary-color) 15%, transparent);
    padding: 5px;

    &:active {
      background-color: color-mix(in srgb, var(--p-primary-color) 30%, transparent);
    }
  }
}

.list-empty {
  color: var(--bolao-c-grey4);
}

.list-proj-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-mint);
  padding: 0;
  line-height: 1;
  text-decoration: underline dotted;
  display: inline-flex;
  align-items: center;
  gap: 3px;

  &:hover {
    color: var(--p-primary-color);
  }
}

.matchup-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.matchup-sep {
  font-size: 0.65em;
  color: var(--bolao-c-grey4);
  margin: 0 var(--xs-spacing);
}

.team-pill {
  display: inline-block;
  padding: 2px 7px;
  font-size: var(--xs-font-size);
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.pts-actual {
  font-weight: bold;
  color: var(--bolao-c-grey1);
}

.pts-sep {
  color: var(--bolao-c-grey4);
}

.pts-proj {
  color: var(--bolao-c-mint);
}

:deep(tr.row--possession) {
  background-color: color-mix(in srgb, var(--bolao-c-mint) 12%, transparent) !important;
}

:deep(tr.row--scoring) {
  background-color: color-mix(in srgb, #e53935 15%, transparent) !important;
}
</style>
