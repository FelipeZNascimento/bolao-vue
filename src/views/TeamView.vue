<template>
  <div class="team-detail">
    <!-- Hero Banner -->
    <div
      class="team-hero"
      :style="teamHeroStyle"
    >
      <RouterLink
        to="/teams"
        class="team-back"
      >
        ← Equipes
      </RouterLink>
      <div class="team-hero-content">
        <img
          v-if="teamInfo"
          :src="teamInfo.logos[0].href"
          :alt="teamInfo.displayName"
          class="team-hero-logo"
        />
        <div
          v-else
          class="team-hero-logo-skeleton"
        />
        <div class="team-hero-text">
          <h1 class="team-hero-name">{{ teamInfo?.displayName ?? '...' }}</h1>
          <p
            v-if="teamInfo"
            class="team-hero-record"
          >
            {{ teamRecord }} · {{ teamInfo.color ? teamInfo.abbreviation : '' }}
          </p>
        </div>
      </div>
      <div
        class="team-hero-overlay"
        :style="teamOverlayStyle"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="team-loading"
    >
      <PrimeSkeleton
        v-for="n in 6"
        :key="n"
        class="team-info-skeleton"
      />
    </div>

    <template v-else>
      <!-- Team Info Section -->
      <section
        v-if="teamInfo && teamVenue"
        class="team-section"
      >
        <h2 class="section-title">Estádio</h2>
        <div class="stadium-card">
          <div
            v-if="stadiumImage"
            class="stadium-image-wrap"
          >
            <img
              :src="stadiumImage"
              :alt="teamVenue.fullName"
              class="stadium-image"
            />
          </div>
          <div class="stadium-info">
            <p class="stadium-name">{{ teamVenue.fullName }}</p>
            <div class="stadium-meta">
              <span
                class="stadium-tag"
                :class="{ 'stadium-tag--blue': !teamVenue.indoor }"
                >{{ teamVenue.indoor ? 'Coberto' : 'Aberto' }}</span
              >
              <span
                class="stadium-tag"
                :class="{ 'stadium-tag--green': teamVenue.grass }"
                >{{ teamVenue.grass ? 'Grama Natural' : 'Grama Sintética' }}</span
              >
            </div>
            <p class="stadium-address">
              {{ teamVenue.address.city }}, {{ teamVenue.address.state }}
              <span v-if="teamVenue.address.zipCode"> · {{ teamVenue.address.zipCode }}</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Season Stats -->
      <section
        v-if="teamRecordStats.length"
        class="team-section"
      >
        <h2 class="section-title">Estatísticas da Temporada</h2>
        <div class="stats-grid">
          <div
            v-for="stat in teamRecordStats"
            :key="stat.label"
            class="stat-card"
          >
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <!-- Roster Sticker Album -->
      <section
        v-if="rosterGroups.length"
        class="team-section"
      >
        <div class="roster-header">
          <h2 class="section-title">Elenco</h2>
          <div class="roster-toggle">
            <button
              v-for="tab in rosterTabs"
              :key="tab.key"
              class="roster-toggle-btn"
              :class="{ 'roster-toggle-btn--active': activeRosterTab === tab.key }"
              :style="activeRosterTab === tab.key ? { '--tab-color': tab.color } : {}"
              @click="activeRosterTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <select
          class="roster-toggle-select"
          :value="activeRosterTab"
          @change="activeRosterTab = ($event.target as HTMLSelectElement).value as RosterTab"
        >
          <option
            v-for="tab in rosterTabs"
            :key="tab.key"
            :value="tab.key"
          >
            {{ tab.label }}
          </option>
        </select>
        <div
          v-for="group in visibleRosterGroups"
          :key="group.label"
          class="roster-group"
        >
          <div
            class="roster-group-header"
            :style="{ '--group-color': groupColor(group.position) }"
          >
            <h3 class="roster-group-label">{{ group.label }}</h3>
            <div class="roster-group-right">
              <span class="roster-group-count">{{ group.players.length }} jogadores</span>
              <div class="roster-sort">
                <button
                  class="roster-sort-btn"
                  :class="{ 'roster-sort-btn--active': rosterSort === 'name' }"
                  @click="rosterSort = 'name'"
                >
                  Nome
                </button>
                <button
                  class="roster-sort-btn"
                  :class="{ 'roster-sort-btn--active': rosterSort === 'position' }"
                  @click="rosterSort = 'position'"
                >
                  Posição
                </button>
              </div>
            </div>
          </div>
          <div class="roster-sticker-grid">
            <PlayerSticker
              v-for="player in sortedPlayers(group.players)"
              :key="player.id"
              :player="player"
              :color="groupColor(group.position)"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useTeamsStore } from '@/stores/teams';
import PlayerSticker from './Team/PlayerSticker.vue';

interface RecordStat {
  name: string;
  value: number;
}

interface RecordItem {
  type: string;
  summary: string;
  stats: RecordStat[];
}

interface EspnVenue {
  fullName: string;
  grass: boolean;
  indoor: boolean;
  address: { city: string; state: string; zipCode?: string; country?: string };
  images?: { href: string; rel: string[] }[];
}

interface EspnTeamInfo {
  id: string;
  displayName: string;
  abbreviation: string;
  color: string;
  alternateColor: string;
  logos: { href: string }[];
  record?: { items: RecordItem[] };
  franchise?: { venue?: EspnVenue };
}

interface RosterPlayer {
  id: string;
  displayName: string;
  shortName: string;
  headshot: string | null;
  jersey: string;
  position: string;
  positionGroup: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  birthPlace: string | null;
  college: string | null;
  experienceYears: number | null;
}

interface RosterGroup {
  position: 'offense' | 'defense' | 'specialTeam' | 'injuredReserveOrOut' | 'suspended' | 'practiceSquad';
  label: string;
  players: RosterPlayer[];
}

const route = useRoute();
const teamsStore = useTeamsStore();

const internalId = computed(() => Number(route.params.id));
const team = computed(() => teamsStore.teams.find((t) => t.id === internalId.value));
const espnId = computed(() => team.value?.espnId);

type RosterTab = 'offense' | 'defense' | 'specialTeam' | 'injuredReserveOrOut' | 'practiceSquad';

const teamInfo = ref<EspnTeamInfo | null>(null);
const rosterGroups = ref<RosterGroup[]>([]);
const isLoading = ref(false);
const error = ref(false);
const activeRosterTab = ref<RosterTab>('offense');
const rosterSort = ref<'name' | 'position'>('position');

function sortedPlayers(players: RosterPlayer[]) {
  return [...players].sort((a, b) =>
    rosterSort.value === 'name'
      ? a.shortName.localeCompare(b.shortName)
      : a.position.localeCompare(b.position) || a.shortName.localeCompare(b.shortName)
  );
}

const rosterTabs: { key: RosterTab; label: string; color: string }[] = [
  {
    key: 'offense',
    label: 'Ataque',
    color: team.value?.foreground ?? '#1565c0'
  },
  {
    key: 'defense',
    label: 'Defesa',
    color: team.value?.background ?? '#be2a2a'
  },
  { key: 'specialTeam', label: 'Times Especiais', color: 'var(--color-contrast)' },
  { key: 'injuredReserveOrOut', label: 'Lesionados', color: 'var(--color-contrast)' },
  { key: 'practiceSquad', label: 'Practice Squad', color: 'var(--color-contrast)' }
];

const TAB_GROUPS: Record<RosterTab, RosterGroup['position'][]> = {
  offense: ['offense'],
  defense: ['defense'],
  specialTeam: ['specialTeam'],
  injuredReserveOrOut: ['injuredReserveOrOut', 'suspended'],
  practiceSquad: ['practiceSquad']
};

const visibleRosterGroups = computed(() =>
  rosterGroups.value.filter((g) => TAB_GROUPS[activeRosterTab.value].includes(g.position))
);

const teamRecord = computed(() => {
  const total = teamInfo.value?.record?.items.find((r) => r.type === 'total');
  return total?.summary ?? '—';
});

const teamVenue = computed(() => teamInfo.value?.franchise?.venue ?? null);

const STAT_CONFIG: { name: string; label: string; format?: (v: number) => string }[] = [
  { name: 'gamesPlayed', label: 'Jogos' },
  { name: 'streak', label: 'Sequência', format: (v) => (v > 0 ? `${v}V` : v < 0 ? `${Math.abs(v)}D` : '—') },
  { name: 'winPercent', label: '% Vitórias', format: (v) => `${(v * 100).toFixed(1)}%` },
  { name: 'avgPointsFor', label: 'Média de Pontos' },
  { name: 'avgPointsAgainst', label: 'Média Sofrida' },
  { name: 'pointDifferential', label: 'Diferencial', format: (v) => (v > 0 ? `+${v}` : String(v)) },
  { name: 'playoffSeed', label: 'Seed Playoffs', format: (v) => (v > 0 ? `#${v}` : '—') },
  { name: 'divisionRecord', label: 'V-D-E Divisão' }
];

const teamRecordStats = computed(() => {
  const total = teamInfo.value?.record?.items.find((r) => r.type === 'total');
  if (!total?.stats) return [];
  const statMap = Object.fromEntries(total.stats.map((s) => [s.name, s.value]));
  return STAT_CONFIG.map(({ name, label, format }) => ({
    label,
    value: name in statMap ? (format ? format(statMap[name]) : String(statMap[name])) : null
  })).filter((s) => s.value !== null);
});

const stadiumImage = computed(() => {
  const images = teamVenue.value?.images;
  if (!images?.length) return null;
  const interior = images.find((img) => img.rel.includes('interior'));
  return (interior ?? images[0]).href;
});

const teamHeroStyle = computed(() => ({
  background: teamInfo.value?.color ? `#${teamInfo.value.color}` : 'var(--bolao-c-navy)'
}));

const teamOverlayStyle = computed(() => {
  const alt = teamInfo.value?.alternateColor ? `#${teamInfo.value.alternateColor}` : 'transparent';
  return { background: `linear-gradient(135deg, transparent 60%, ${alt}66)` };
});

function groupColor(pos: RosterGroup['position']) {
  const map: Record<RosterGroup['position'], string> = {
    offense: team.value?.foreground ?? '#1565c0',
    defense: team.value?.background ?? '#be2a2a',
    specialTeam: 'var(--color-contrast)',
    injuredReserveOrOut: 'var(--color-contrast)',
    suspended: 'var(--color-contrast)',
    practiceSquad: 'var(--color-contrast)'
  };
  return map[pos] ?? '#cfd8dc';
}

function groupLabel(pos: string): string {
  const map: Record<string, string> = {
    offense: 'Ataque',
    defense: 'Defesa',
    specialTeam: 'Times Especiais',
    injuredReserveOrOut: 'Lesionados / Fora',
    suspended: 'Suspensos',
    practiceSquad: 'Practice Squad'
  };
  return map[pos] ?? pos;
}

async function fetchTeam(id: number | undefined) {
  if (!id) return;
  isLoading.value = true;
  error.value = false;
  teamInfo.value = null;
  rosterGroups.value = [];

  try {
    const [teamRes, rosterRes] = await Promise.all([
      fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${id}/`),
      fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${id}/roster`)
    ]);
    const teamData = await teamRes.json();
    const rosterData = await rosterRes.json();

    teamInfo.value = teamData.team;
    rosterGroups.value = (rosterData.athletes ?? [])
      .filter((g: any) => g.items?.length > 0)
      .map((g: any): RosterGroup => ({
        position: g.position as RosterGroup['position'],
        label: groupLabel(g.position),
        players: g.items.map((p: any): RosterPlayer => ({
          id: p.id,
          displayName: p.displayName,
          shortName: p.shortName,
          headshot: p.headshot?.href ?? null,
          jersey: p.jersey ?? '—',
          position: p.position?.abbreviation ?? '—',
          positionGroup: g.position,
          age: p.age ?? null,
          heightCm: p.height != null ? Math.round(p.height * 2.54) : null,
          weightKg: p.weight != null ? Math.round(p.weight * 0.453592) : null,
          birthPlace: p.birthPlace
            ? [p.birthPlace.city, p.birthPlace.state, p.birthPlace.country].filter(Boolean).join(', ')
            : null,
          college: p.college?.shortName ?? null,
          experienceYears: p.experience?.years ?? null
        }))
      }));
  } catch {
    error.value = true;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchTeam(espnId.value));
watch(espnId, (id) => fetchTeam(id));
</script>

<style lang="scss" scoped>
.team-detail {
  min-height: 100vh;
}

.team-hero {
  position: relative;
  padding: var(--l-spacing) var(--xl-spacing) var(--xl-spacing);
  overflow: hidden;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media (max-width: 767px) {
    padding: var(--m-spacing) var(--m-spacing) var(--l-spacing);
  }
}

.team-hero-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.team-back {
  position: absolute;
  top: var(--m-spacing);
  left: var(--xl-spacing);
  color: #ffffffcc;
  text-decoration: none;
  font-size: var(--s-font-size);
  z-index: 2;
  transition: color 0.15s;

  &:hover {
    color: #fff;
  }

  @media (max-width: 767px) {
    left: var(--m-spacing);
  }
}

.team-hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  gap: var(--l-spacing);
}

.team-hero-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 4px 16px #0005);

  @media (max-width: 767px) {
    width: 80px;
    height: 80px;
  }
}

.team-hero-logo-skeleton {
  width: 120px;
  height: 120px;
  background: #ffffff22;
  border-radius: 50%;
}

.team-hero-text {
  display: flex;
  flex-direction: column;
  gap: var(--xxs-spacing);
}

.team-hero-name {
  font-size: var(--xxl-font-size);
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 8px #0004;
  line-height: 1;

  @media (max-width: 767px) {
    font-size: var(--xl-font-size);
  }
}

.team-hero-record {
  font-size: var(--m-font-size);
  color: #ffffffbb;
  font-weight: 600;
}

.team-section {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: var(--l-spacing) var(--xl-spacing);

  @media (max-width: 767px) {
    padding: var(--m-spacing) var(--s-spacing);
  }
}

.section-title {
  font-size: var(--l-font-size);
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: var(--m-spacing);
  padding-bottom: var(--xs-spacing);
  border-bottom: 2px solid var(--bolao-c-grey2-t1);
}

.team-loading {
  display: flex;
  gap: var(--m-spacing);
  flex-wrap: wrap;
  padding: var(--l-spacing) var(--xl-spacing);
}

.team-info-skeleton {
  height: 80px !important;
  width: 200px !important;
}

.stadium-card {
  display: flex;
  gap: var(--l-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  overflow: hidden;

  @media (max-width: 767px) {
    flex-direction: column;
  }
}

.stadium-image-wrap {
  flex: 0 0 340px;
  max-height: 220px;
  overflow: hidden;

  @media (max-width: 767px) {
    flex: none;
    width: 100%;
    max-height: 180px;
  }
}

.stadium-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.stadium-info {
  padding: var(--m-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  justify-content: center;
}

.stadium-name {
  font-size: var(--l-font-size);
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.2;
}

.stadium-meta {
  display: flex;
  gap: var(--xs-spacing);
  flex-wrap: wrap;
}

.stadium-tag {
  font-size: var(--xs-font-size);
  font-weight: 600;
  padding: 2px 10px;
  background: var(--bolao-c-grey2-t1);
  color: var(--bolao-c-grey1);
  letter-spacing: 0.04em;

  &--blue {
    background: var(--bolao-c-blue-t2);
  }

  &--green {
    background: var(--bolao-c-green-t2);
  }
}

.stadium-address {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: var(--s-spacing);
}

.stat-card {
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  padding: var(--m-spacing) var(--s-spacing);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--xxs-spacing);
  text-align: center;
}

.stat-value {
  font-size: var(--xl-font-size);
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1;
}

.stat-label {
  font-size: var(--xxs-font-size);
  color: var(--color-contrast);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.roster-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-spacing);
  margin-bottom: var(--m-spacing);

  .section-title {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
  }
}

.roster-toggle {
  display: flex;
  gap: var(--xs-spacing);
}

.roster-toggle-select {
  display: none;

  @media (max-width: 600px) {
    display: block;
    width: 100%;
    margin-bottom: var(--m-spacing);
    padding: var(--xs-spacing) var(--s-spacing);
    background: var(--color-background-soft);
    border: 2px solid var(--bolao-c-grey2-t1);
    color: var(--color-heading);
    font-size: var(--s-font-size);
    font-weight: 600;
    cursor: pointer;
  }
}

.roster-toggle-btn {
  @media (max-width: 600px) {
    display: none;
  }
  display: flex;
  align-items: center;
  gap: var(--xxs-spacing);
  padding: var(--xxs-spacing) var(--m-spacing);
  background: var(--color-background-soft);
  border: 2px solid var(--bolao-c-grey2-t1);
  color: var(--bolao-c-grey4);
  font-size: var(--s-font-size);
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;

  &--active {
    border-color: var(--tab-color, var(--bolao-c-sky));
  }

  &:not(.roster-toggle-btn--active):hover {
    border-color: var(--bolao-c-grey3);
    color: var(--color-heading);
  }
}

.roster-group {
  margin-bottom: var(--xl-spacing);
}

.roster-group-header {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
  margin-bottom: var(--m-spacing);
  padding: var(--xs-spacing) var(--m-spacing);
  background: var(--color-background-soft);
  border-left: 4px solid var(--group-color, var(--bolao-c-sky));
}

.roster-group-icon {
  font-size: var(--m2-font-size);
}

.roster-group-right {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);
}

.roster-sort {
  display: flex;
  gap: var(--s-spacing);
}

.roster-sort-btn {
  padding: 2px var(--xs-spacing);
  font-size: var(--xs-font-size);
  font-weight: 600;
  background: transparent;
  border: 1px solid var(--bolao-c-grey2-t1);
  color: var(--bolao-c-grey4);
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;
  letter-spacing: 0.03em;

  &--active {
    border-color: var(--color-contrast);
    color: var(--color-contrast, var(--bolao-c-sky));
    background: color-mix(in srgb, var(--color-contrast) 10%, transparent);
  }

  &:not(.roster-sort-btn--active):hover {
    border-color: var(--bolao-c-grey3);
    color: var(--color-heading);
  }
}

.roster-group-label {
  font-size: var(--m2-font-size);
  font-weight: 700;
  color: var(--color-heading);
  flex: 1;
}

.roster-group-count {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
}

.roster-sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--m-spacing);

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
