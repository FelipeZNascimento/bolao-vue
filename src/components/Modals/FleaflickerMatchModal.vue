<template>
  <PrimeDialog
    :visible="isOpen"
    modal
    dismissableMask
    :style="{ width: '95vw', maxWidth: '860px' }"
    :draggable="false"
    @update:visible="(v: boolean) => !v && handleCloseModal()"
  >
    <!-- Header -->
    <template #header>
      <span
        v-if="boxscore?.game.isInProgress"
        class="bm-live-badge"
      >
        <i class="pi pi-circle-fill bm-live-dot" />
      </span>
      <h3>
        {{ !boxscore ? 'Boxscore' : `${boxscore.game.away.name} vs ${boxscore.game.home.name}` }}
      </h3>
    </template>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="bm-state"
    >
      <i class="pi pi-spinner pi-spin" />
      Carregando boxscore...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="bm-state bm-state--error"
    >
      <i class="pi pi-exclamation-triangle" />
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else-if="boxscore">
      <!-- Scoreboard header -->
      <div class="bm-scoreboard">
        <div style="display: flex; flex: 1">
          <div class="bm-team bm-team--away">
            <img
              v-if="boxscore.game.away.logoUrl"
              :src="boxscore.game.away.logoUrl"
              class="bm-team-logo"
              :alt="boxscore.game.away.name"
            />
            <span
              v-else
              class="bm-team-initials"
              >{{ boxscore.game.away.initials }}</span
            >
            <span class="bm-team-name">{{ boxscore.game.away.name }}</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center">
            <span class="bm-score-actual">{{ boxscore.game.awayScore.score.formatted }}</span>
            <span class="bm-proj">({{ boxscore.game.awayScore.projected?.formatted ?? '–' }})</span>
          </div>
        </div>
        <div style="display: flex">x</div>
        <div style="display: flex; flex: 1">
          <div style="display: flex; flex-direction: column; align-items: center">
            <span class="bm-score-actual">{{ boxscore.game.homeScore.score.formatted }}</span>
            <span class="bm-proj">({{ boxscore.game.homeScore.projected?.formatted ?? '–' }})</span>
          </div>
          <div class="bm-team bm-team--home">
            <img
              v-if="boxscore.game.home.logoUrl"
              :src="boxscore.game.home.logoUrl"
              class="bm-team-logo"
              :alt="boxscore.game.home.name"
            />
            <span
              v-else
              class="bm-team-initials"
              >{{ boxscore.game.home.initials }}</span
            >
            <span class="bm-team-name">{{ boxscore.game.home.name }}</span>
          </div>
        </div>
      </div>
      <!-- Lineups -->
      <div
        v-for="lineup in boxscore.lineups"
        :key="lineup.group"
        class="bm-lineup-group"
      >
        <h4 class="bm-group-label">{{ groupLabel(lineup.group) || 'Reservas' }}</h4>
        <div class="bm-slot-list">
          <div
            v-for="(slot, idx) in lineup.slots"
            :key="idx"
            class="bm-slot"
          >
            <!-- Away player -->
            <div class="bm-player bm-player--away">
              <template v-if="slot.away">
                <img
                  v-if="slot.away.proPlayer.headshotUrl"
                  :src="slot.away.proPlayer.headshotUrl"
                  class="bm-headshot"
                  :alt="slot.away.proPlayer.nameShort"
                />
                <div class="bm-player-info">
                  <span class="bm-player-name">{{ slot.away.proPlayer.nameShort }}</span>
                  <span class="bm-player-meta"
                    >{{ slot.away.proPlayer.proTeamAbbreviation }} · {{ slot.away.proPlayer.position }}</span
                  >
                </div>
                <div class="bm-player-pts">
                  <span
                    v-if="slot.away.viewingActualPoints"
                    class="bm-pts-actual"
                  >
                    {{ slot.away.viewingActualPoints.formatted }}
                  </span>
                  <span
                    v-if="slot.away.viewingProjectedPoints"
                    class="bm-pts-proj"
                  >
                    ({{ slot.away.viewingProjectedPoints.formatted }})
                  </span>
                </div>
              </template>
              <span
                v-else
                class="bm-empty"
                >—</span
              >
            </div>

            <!-- Position label -->
            <span class="bm-pos-label">{{ slot.position.label }}</span>

            <!-- Home player -->
            <div class="bm-player bm-player--home">
              <template v-if="slot.home">
                <div class="bm-player-pts">
                  <span
                    v-if="slot.home.viewingActualPoints"
                    class="bm-pts-actual"
                  >
                    {{ slot.home.viewingActualPoints.formatted }}
                  </span>
                  <span
                    v-else-if="slot.home.viewingProjectedPoints"
                    class="bm-pts-proj"
                  >
                    ({{ slot.home.viewingProjectedPoints.formatted }})
                  </span>
                </div>
                <div class="bm-player-info bm-player-info--right">
                  <span class="bm-player-name">{{ slot.home.proPlayer.nameShort }}</span>
                  <span class="bm-player-meta"
                    >{{ slot.home.proPlayer.proTeamAbbreviation }} · {{ slot.home.proPlayer.position }}</span
                  >
                </div>
                <img
                  v-if="slot.home.proPlayer.headshotUrl"
                  :src="slot.home.proPlayer.headshotUrl"
                  class="bm-headshot"
                  :alt="slot.home.proPlayer.nameShort"
                />
              </template>
              <span
                v-else-if="slot.leaguePlayer"
                class="bm-player-name"
                >{{ slot.leaguePlayer.proPlayer.nameShort }}</span
              >
              <span
                v-else
                class="bm-empty"
                >—</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import ApiService from '@/services/api_request';
import type { IFleaflickerBoxscore, IFleaflickerMatchPayload } from '@/stores/fleaflicker.types';
import { useModalsStore } from '@/stores/modals';

defineProps<{
  isOpen: boolean;
  handleCloseModal: () => void;
}>();

const { modalPayload } = storeToRefs(useModalsStore());
const payload = computed(() => modalPayload.value[0] as IFleaflickerMatchPayload | undefined);

const apiService = new ApiService();
const boxscore = ref<IFleaflickerBoxscore | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchBoxscore(p: IFleaflickerMatchPayload) {
  isLoading.value = true;
  error.value = null;
  boxscore.value = null;
  try {
    boxscore.value = await apiService.get<IFleaflickerBoxscore>(
      `fleaflicker/boxscore/${p.leagueId}?gameId=${p.gameId}&scoringPeriod=${p.week}`
    );
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar boxscore.';
  } finally {
    isLoading.value = false;
  }
}

watch(
  payload,
  (p) => {
    if (p) fetchBoxscore(p);
  },
  { immediate: true }
);

function groupLabel(group: string): string {
  const map: Record<string, string> = {
    START: 'Titulares',
    BENCH: 'Reservas',
    IR: 'Lesionados'
  };
  return map[group] ?? group;
}
</script>
<style scoped>
.bm-state {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  justify-content: center;
  padding: var(--xl-spacing);
  color: var(--bolao-c-grey3);
}

.bm-state--error {
  color: var(--bolao-c-red);
}

/* ── Scoreboard ── */
.bm-scoreboard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-spacing);
  padding: var(--m-spacing) 0 var(--l-spacing);
}

.bm-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--xs-spacing);
  flex: 1;
  min-width: 0;
}

.bm-team--home {
  align-items: center;
}

.bm-team-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 50%;
}

.bm-team-initials {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bolao-c-grey5);
  border-radius: 50%;
  font-weight: 700;
  font-size: var(--s-font-size);
}

.bm-team-name {
  font-size: var(--xs-font-size);
  font-weight: 600;
  text-align: center;
  color: var(--p-text-muted-color);
}

.bm-scores {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.bm-score-actual {
  font-size: var(--l-font-size);
  font-weight: 700;
}

.bm-score-sep {
  font-size: var(--m-font-size);
  color: var(--p-text-muted-color);
}

.bm-projected-row {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
}

.bm-proj {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-mint);
}

.bm-live-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--bolao-c-red);
  margin-top: 2px;
}

.bm-live-dot {
  position: absolute;
  top: var(--s-spacing);
  left: var(--s-spacing);
  font-size: 6px;
  animation: blink 1.2s step-start infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* ── Lineup groups ── */
.bm-lineup-group {
  margin-bottom: var(--m-spacing);
}

.bm-group-label {
  font-size: var(--xs-font-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--bolao-c-grey2);
  margin: 0 0 var(--xs-spacing);
  padding: var(--xs-spacing);
  border-bottom: 1px solid var(--bolao-c-grey3);
}

.bm-slot-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── Slot row ── */
.bm-slot {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--xs-spacing);
  border-radius: var(--s-border-radius);
  background: light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.04));

  &:nth-child(even) {
    background: light-dark(rgba(0, 0, 0, 0.09), rgba(255, 255, 255, 0.09));
  }
  @media (max-width: 1023px) {
    padding: var(--xs-spacing) var(--xxs-spacing);
  }

  @media (min-width: 1024px) {
    padding: var(--xs-spacing) var(--s-spacing);
  }
}
.bm-pos-label {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--p-text-muted-color);
  text-align: center;
  min-width: 3rem;
}

/* ── Player cell ── */
.bm-player {
  display: flex;
  align-items: center;
  gap: var(--xs-spacing);
  min-width: 0;
}

.bm-player--home {
  /* flex-direction: row-reverse; */
}

.bm-headshot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--bolao-c-grey5);
}

.bm-player-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.bm-player-info--right {
  align-items: flex-end;
}

.bm-player-name {
  font-size: var(--xs-font-size);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bm-player-meta {
  font-size: 10px;
  color: var(--p-text-muted-color);
}

.bm-player-pts {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  text-align: center;
}

.bm-player--home .bm-player-pts {
  text-align: left;
}

.bm-pts-actual {
  font-size: var(--xs-font-size);
  font-weight: 700;
  color: var(--bolao-c-white);
}

.bm-pts-proj {
  font-size: var(--xxs-font-size);
  color: var(--bolao-c-mint);
}

.bm-empty {
  font-size: var(--xs-font-size);
  color: var(--p-text-muted-color);
}
</style>
