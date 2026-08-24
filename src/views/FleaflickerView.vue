<template>
  <div class="outer-fleaflicker">
    <div class="page-header">
      <a
        class="team-logo"
        href="https://www.fleaflicker.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/fleaflicker.png"
          alt="Fleaflicker"
        />
        <h1 class="team-name">Fleaflicker <i class="pi pi-external-link" /></h1>
      </a>
      .
      <div
        class="page-header-info"
        v-if="owner"
      >
        <div class="team-identity">
          <a
            class="team-logo"
            :href="`https://www.fleaflicker.com/nfl/leagues/${activeProfile?.fleaflicker?.leagueId}/teams/${activeProfile?.fleaflicker?.teamId}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              :src="owner.logoUrl"
              :alt="owner.name"
            />
            <h1 class="team-name">{{ owner.name }} <i class="pi pi-external-link" /></h1>
          </a>
        </div>
      </div>
    </div>

    <nav class="tab-nav">
      <button
        v-for="tab in TABS"
        :key="tab.id"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.id }"
        @click="setTab(tab.id)"
      >
        <i :class="tab.icon" />
        {{ tab.label }}
      </button>
      <button
        class="tab-btn"
        text
        rounded
        size="large"
        :loading="isLoadingRoster || isLoadingStandings || isLoadingScoreboard"
        :disabled="!activeProfile?.fleaflicker"
        @click="refreshAll"
      >
        <i class="pi pi-refresh" />
        Atualizar
      </button>
    </nav>

    <FleaflickerRosterView
      v-if="activeTab === 'roster'"
      :roster="roster"
      :isLoading="isProfileLoading || isLoadingRoster"
      :isLinked="!!activeProfile?.fleaflicker"
      :error="errorRoster"
    />
    <FleaflickerStandingsView
      v-else-if="activeTab === 'classificacao'"
      :standings="standings"
      :isLoading="isProfileLoading || isLoadingStandings"
      :isLinked="!!activeProfile?.fleaflicker"
      :error="errorStandings"
    />
    <FleaflickerScoresView
      v-else-if="activeTab === 'placares'"
      :scoreboard="scoreboard"
      :isLoading="isProfileLoading || isLoadingScoreboard"
      :isLinked="!!activeProfile?.fleaflicker"
      :error="errorScoreboard"
      @fetch-week="fetchScoreboard"
    />
    <FleaflickerConfigView
      v-else-if="activeTab === 'config'"
      :isLinked="!!activeProfile?.fleaflicker"
    />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ApiService from '@/services/api_request';
import { useActiveProfileStore } from '@/stores/activeProfile';
import type {
  IFleaflickerOwner,
  IFleaflickerRoster,
  IFleaflickerScoreboard,
  IFleaflickerStandings
} from '@/stores/fleaflicker.types';
import FleaflickerConfigView from './Fleaflicker/FleaflickerConfigView.vue';
import FleaflickerRosterView from './Fleaflicker/FleaflickerRosterView.vue';
import FleaflickerScoresView from './Fleaflicker/FleaflickerScoresView.vue';
import FleaflickerStandingsView from './Fleaflicker/FleaflickerStandingsView.vue';

const activeProfileStore = useActiveProfileStore();
const { activeProfile, isLoading: isProfileLoading } = storeToRefs(activeProfileStore);
const apiService = new ApiService();
const route = useRoute();
const router = useRouter();

// ── Tabs ──
type TTab = 'roster' | 'classificacao' | 'placares' | 'config';

const TABS: { id: TTab; label: string; icon: string }[] = [
  { id: 'roster', label: 'Roster', icon: 'pi pi-users' },
  { id: 'classificacao', label: 'Classificação', icon: 'pi pi-chart-bar' },
  { id: 'placares', label: 'Placares', icon: 'pi pi-flag' },
  { id: 'config', label: 'Config', icon: 'pi pi-cog' }
];

const VALID_TABS = new Set<TTab>(TABS.map((t) => t.id));

function resolveTab(raw: unknown): TTab {
  const val = Array.isArray(raw) ? raw[0] : raw;
  return typeof val === 'string' && VALID_TABS.has(val as TTab) ? (val as TTab) : 'roster';
}

const activeTab = ref<TTab>(resolveTab(route.query.tab));

function setTab(tab: TTab) {
  activeTab.value = tab;
  router.replace({ query: { ...route.query, tab } });
}

// Sync if user navigates back/forward
watch(
  () => route.query.tab,
  (val) => {
    activeTab.value = resolveTab(val);
  }
);

// ── Roster data ──
const roster = ref<IFleaflickerRoster | null>(null);
const standings = ref<IFleaflickerStandings | null>(null);
const scoreboard = ref<IFleaflickerScoreboard | null>(null);
const owner = ref<IFleaflickerOwner | null>(null);
const isLoadingRoster = ref(false);
const isLoadingStandings = ref(false);
const isLoadingScoreboard = ref(false);
const errorRoster = ref<string | null>(null);
const errorStandings = ref<string | null>(null);
const errorScoreboard = ref<string | null>(null);

// teamId from query param — null means "my team"
const viewingTeamId = computed<number | null>(() => {
  const raw = route.query.teamId;
  const val = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(val);
  return val && !isNaN(n) ? n : null;
});

async function fetchRoster() {
  if (!activeProfile.value?.fleaflicker) return;
  const { leagueId, teamId: myTeamId } = activeProfile.value.fleaflicker;
  const teamId = viewingTeamId.value ?? myTeamId;
  isLoadingRoster.value = true;
  errorRoster.value = null;
  try {
    roster.value = await apiService.get<IFleaflickerRoster>(`fleaflicker/roster/${leagueId}/${teamId}`);
    const firstPlayer = roster.value?.groups.flatMap((g) => g.slots).find((s) => s.leaguePlayer?.owner);
    owner.value = firstPlayer?.leaguePlayer?.owner ?? null;
  } catch (e) {
    errorRoster.value = e instanceof Error ? e.message : 'Erro ao carregar elenco.';
  } finally {
    isLoadingRoster.value = false;
  }
}

async function fetchStandings() {
  if (!activeProfile.value?.fleaflicker) return;
  const { leagueId } = activeProfile.value.fleaflicker;
  if (!leagueId) return;
  isLoadingStandings.value = true;
  errorStandings.value = null;
  try {
    standings.value = await apiService.get<IFleaflickerStandings>(`fleaflicker/standings/${leagueId}`);
  } catch (e) {
    errorStandings.value = e instanceof Error ? e.message : 'Erro ao carregar classificação.';
  } finally {
    isLoadingStandings.value = false;
  }
}

async function fetchScoreboard(week?: number) {
  if (!activeProfile.value?.fleaflicker) return;
  const { leagueId } = activeProfile.value.fleaflicker;
  isLoadingScoreboard.value = true;
  errorScoreboard.value = null;
  try {
    const url = week ? `fleaflicker/boxscore/${leagueId}?scoringPeriod=${week}` : `fleaflicker/boxscore/${leagueId}`;
    scoreboard.value = await apiService.get<IFleaflickerScoreboard>(url);
  } catch (e) {
    errorScoreboard.value = e instanceof Error ? e.message : 'Erro ao carregar placares.';
  } finally {
    isLoadingScoreboard.value = false;
  }
}

watch(
  activeProfile,
  (profile) => {
    if (profile?.fleaflicker) {
      fetchRoster();
      fetchStandings();
      fetchScoreboard();
    }
  },
  { immediate: true }
);

function refreshAll() {
  if (!activeProfile.value?.fleaflicker) return;
  fetchRoster();
  fetchStandings();
  fetchScoreboard();
}

// Re-fetch roster when teamId query param changes
watch(viewingTeamId, () => {
  if (activeProfile.value?.fleaflicker) fetchRoster();
});
</script>
<style scoped>
.outer-fleaflicker {
  padding: var(--l-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--xl-spacing);
  max-width: var(--page-width);
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);

  .view-toggle {
    margin-left: auto;
  }
}

.roster-filter {
  width: 100%;
}

.page-header-info {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}

.fleaflicker-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.team-identity {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.team-logo {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);

  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 50%;
  }
}

.team-name {
  color: light-dark(var(--bolao-c-grey4), var(--bolao-c-grey2));
}

.state-message {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  padding: var(--xl-spacing);
  justify-content: center;
  color: var(--bolao-c-grey4);
}

.group-section {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.group-title {
  font-size: var(--l-font-size);
  color: light-dark(var(--bolao-c-grey5), var(--bolao-c-grey3));
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--m-spacing);
}

.tab-nav {
  display: flex;
  align-items: center;
  gap: var(--xs-spacing);
  border-bottom: 2px solid light-dark(var(--bolao-c-grey2), var(--bolao-c-grey6));
  padding-bottom: 0;
}

.refresh-btn {
  margin-left: auto;
  margin-bottom: -2px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--xs-spacing);
  padding: var(--s-spacing) var(--m-spacing);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  font-size: var(--s-font-size);
  color: light-dark(var(--bolao-c-grey5), var(--bolao-c-grey3));
  border-radius: var(--s-border-radius) var(--s-border-radius) 0 0;
  transition:
    color 0.15s,
    background 0.15s;

  i {
    font-size: 0.85em;
  }

  &:hover {
    color: var(--p-primary-color);
    background: light-dark(var(--bolao-c-grey1), var(--bolao-c-grey7));
  }

  &.tab-btn--active {
    color: var(--p-primary-color);
    border-bottom-color: var(--p-primary-color);
    font-weight: 600;
  }
}
</style>
