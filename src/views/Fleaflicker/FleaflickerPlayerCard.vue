<template>
  <div
    class="slot-card"
    :class="{
      'slot-card--empty': !slot.leaguePlayer,
      'slot-card--possession': game?.hasPossession && !game?.inScoringPosition,
      'slot-card--scoring': game?.inScoringPosition
    }"
  >
    <template v-if="slot.leaguePlayer">
      <span class="player-headshot-wrap">
        <img
          v-if="slot.leaguePlayer.proPlayer.headshotUrl && !showCardFallback"
          :src="slot.leaguePlayer.proPlayer.headshotUrl"
          :alt="slot.leaguePlayer.proPlayer.nameFull"
          class="player-headshot"
          @error="showCardFallback = true"
        />
        <i
          v-else
          class="pi pi-user player-headshot-fallback"
        />
      </span>
      <div class="player-info">
        <span class="player-name">
          {{ slot.leaguePlayer.proPlayer.nameFull }}
        </span>
        <div class="player-meta">
          <span class="player-position">
            <span
              v-if="game?.isProjectedStarter"
              class="projected-star"
              v-tooltip.top="'Provável titular'"
            >
              ★
            </span>
            {{ slot.leaguePlayer.proPlayer.position }}
          </span>
          <span
            class="team-pill"
            :style="teamPillStyle(slot.leaguePlayer.proPlayer.proTeamAbbreviation)"
          >
            {{ slot.leaguePlayer.proPlayer.proTeamAbbreviation }}
          </span>

          <!-- <span class="player-team">
            {{ slot.leaguePlayer.proPlayer.proTeamAbbreviation }}
          </span> -->
          <span
            v-if="slot.leaguePlayer.proPlayer.injury"
            class="player-injury"
            v-tooltip.top="slot.leaguePlayer.proPlayer.injury.typeFull"
          >
            {{ slot.leaguePlayer.proPlayer.injury.typeAbbreviaition }}
          </span>
        </div>
        <div style="display: flex">
          <button
            v-if="slot.leaguePlayer.viewingProjectedPoints || game?.pointsActual"
            class="proj-btn"
            v-tooltip.bottom="{
              value: statsTooltip(slot.leaguePlayer),
              disabled: isMobile
            }"
            @click="openProjectedStatsModal(slot.leaguePlayer)"
            :aria-label="`Estatísticas de ${slot.leaguePlayer.proPlayer.nameFull}`"
          >
            <template v-if="game?.pointsActual">
              <span class="pts-actual">{{ game.pointsActual.formatted }}</span>
              <span
                v-if="slot.leaguePlayer.viewingProjectedPoints"
                class="pts-sep"
                >/</span
              >
              <span
                v-if="slot.leaguePlayer.viewingProjectedPoints"
                class="pts-proj"
                >{{ slot.leaguePlayer.viewingProjectedPoints.formatted }} proj.</span
              >
            </template>
            <template v-else> {{ slot.leaguePlayer.viewingProjectedPoints!.formatted }} pts proj. </template>
          </button>
          <span v-if="adversary">
            <span class="matchup-sep">vs</span>
            <span style="font-size: var(--xs-font-size)">{{ adversary.abbreviation }}</span>
          </span>
        </div>
      </div>
      <img
        v-if="game?.hasPossession"
        src="/src/img/football.png"
        class="possession-ball"
        alt="possession"
        v-tooltip.bottom="{ value: 'Posse', disabled: isMobile }"
      />
      <span class="slot-label">{{ slot.position.label }}</span>
      <span
        v-if="slot.leaguePlayer.proPlayer.nflByeWeek"
        class="bye-indicator"
        v-tooltip.bottom="`Bye: semana ${slot.leaguePlayer.proPlayer.nflByeWeek}`"
      >
        <i class="pi pi-moon" />
        {{ slot.leaguePlayer.proPlayer.nflByeWeek }}
      </span>
      <button
        v-if="slot.leaguePlayer.proPlayer.news?.length"
        class="news-btn"
        v-tooltip.top="{
          value: slot.leaguePlayer.proPlayer.news[0].title,
          disabled: isMobile
        }"
        @click="openPlayerNewsModal(slot.leaguePlayer.proPlayer.news[0])"
        :aria-label="`Notícias de ${slot.leaguePlayer.proPlayer.nameFull}`"
      >
        <i class="pi pi-file" />
      </button>
    </template>
    <template v-else>
      <span class="slot-label">{{ slot.position.label }}</span>
      <span class="empty-label">Vazio</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { IFleaflickerLeaguePlayer, IFleaflickerSlot, IFleaflickerTeam } from '@/stores/fleaflicker.types';
import { useModalsStore } from '@/stores/modals';
import { useTeamsStore } from '@/stores/teams';

const { slot } = defineProps<{ slot: IFleaflickerSlot }>();

const isMobile = window.matchMedia('(max-width: 768px)').matches;

const { openPlayerNewsModal, openProjectedStatsModal } = useModalsStore();
const { teams } = useTeamsStore();

const showCardFallback = ref(!slot.leaguePlayer?.proPlayer.headshotUrl);

const game = computed(() => {
  const games = slot.leaguePlayer?.requestedGames;
  if (!games?.length) return null;
  return games.find((g) => g.hasPossession) ?? games[0];
});

const adversary = computed((): IFleaflickerTeam | null => {
  if (!game.value) return null;
  return game.value.participant === 'HOME' ? game.value.game.away : game.value.game.home;
});

function statsTooltip(player: IFleaflickerLeaguePlayer): string {
  const parts: string[] = [];
  if (game.value?.pointsActual) {
    const actual = game.value.stats.map((s) => `${s.category.abbreviation}: ${s.value.formatted}`).join(' · ');
    parts.push(`Real: ${actual}`);
  }
  if (player.viewingProjectedStats?.length) {
    const proj = player.viewingProjectedStats
      .map((s) => `${s.category.abbreviation}: ${s.value.formatted}`)
      .join(' · ');
    parts.push(`Proj.: ${proj}`);
  }
  return parts.join('\n');
}

function teamPillStyle(abbr: string): Record<string, string> {
  const team = teams.find((t) => t.code === abbr);
  if (!team) return {};
  return {
    backgroundColor: `${team.background}`,
    color: `${team.foreground}`
  };
}
</script>
<style scoped>
.slot-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--xl-spacing) var(--s-spacing);
  border-radius: var(--border-radius);
  background-color: light-dark(var(--bolao-c-black-t3), var(--bolao-c-grey4-t1));
  position: relative;
  text-align: center;
}

.slot-card--empty {
  opacity: 0.4;
}

.slot-card--possession {
  box-shadow: 0 0 0 2px var(--bolao-c-mint);
}

.slot-card--scoring {
  box-shadow: 0 0 0 2px #e53935;
}

.player-headshot-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bolao-c-grey5);
  overflow: hidden;
}

.player-headshot {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 50%;
}

.player-headshot-fallback {
  font-size: 2rem;
  color: var(--bolao-c-grey3);
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-name {
  font-weight: bold;
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey2);
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.possession-ball {
  position: absolute;
  bottom: var(--xs-spacing);
  left: var(--xs-spacing);
  width: 16px;
  height: 16px;
}

.projected-star {
  color: var(--bolao-c-gold);
  font-size: 0.65rem;
  cursor: default;
  line-height: 1;
}

.player-meta {
  display: flex;
  gap: var(--xs-spacing);
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
  align-items: center;
}

.player-injury {
  color: var(--bolao-c-gold);
  font-weight: bold;
  cursor: default;
}

.matchup-sep {
  margin: 0 3px;
  color: var(--bolao-c-grey4);
  font-size: var(--xxs-font-size);
}

.proj-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-mint);
  padding: 0;
  line-height: 1;
  text-decoration: underline dotted;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: var(--p-primary-color);
  }
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

.slot-label {
  position: absolute;
  top: var(--xs-spacing);
  left: var(--xs-spacing);
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
  font-weight: bold;
}

.empty-label {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  margin-top: var(--xl-spacing);
}

.bye-indicator {
  position: absolute;
  bottom: var(--xs-spacing);
  right: var(--xs-spacing);
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
  cursor: default;

  .pi {
    font-size: 0.65rem;
  }
}

.news-btn {
  position: absolute;
  top: var(--xs-spacing);
  right: var(--xs-spacing);
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
    transform: scale(1.2);
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

.team-pill {
  display: inline-block;
  padding: 2px 7px;
  font-size: var(--xs-font-size);
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
</style>
