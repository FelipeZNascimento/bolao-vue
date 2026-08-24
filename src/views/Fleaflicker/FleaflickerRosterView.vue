<template>
  <div class="roster-view">
    <div
      v-if="!isViewingOwnTeam"
      class="viewing-other-banner"
    >
      <span><i class="pi pi-eye" /> Você está vendo o elenco de outro time.</span>
      <RouterLink :to="{ path: '/fleaflicker', query: { tab: 'roster' } }">
        <PrimeButton
          label="Ver meu time"
          icon="pi pi-home"
          size="small"
          variant="outlined"
        />
      </RouterLink>
    </div>

    <div class="roster-controls">
      <PrimeInputText
        v-model="filterQuery"
        placeholder="Filtrar por nome, posição ou time..."
        class="roster-filter"
      />
      <PrimeSelectButton
        v-model="viewMode"
        :options="viewModeOptions"
        optionValue="value"
      >
        <template #option="{ option }">
          <i :class="option.icon" />
        </template>
      </PrimeSelectButton>
    </div>

    <div
      v-if="isLoading"
      class="state-message"
    >
      <i class="pi pi-spinner pi-spin" />
      Carregando elenco...
    </div>

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

    <PrimeMessage
      v-else-if="error"
      severity="error"
      variant="outlined"
    >
      {{ error }}
    </PrimeMessage>

    <template v-else-if="viewMode === 'grid'">
      <section
        v-for="group in filteredGroups"
        :key="group.group"
        class="group-section"
      >
        <h2 class="group-title">{{ groupLabel(group.group) }}</h2>
        <div class="slots-grid">
          <FleaflickerPlayerCard
            v-for="(slot, i) in group.slots"
            :key="i"
            :slot="slot"
          />
        </div>
      </section>
    </template>

    <template v-else>
      <FleaflickerPlayerTable :slots="filteredSlots" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useActiveProfileStore } from '@/stores/activeProfile';
import type { IFleaflickerFlatSlot, IFleaflickerRoster, TFleaflickerGroup } from '@/stores/fleaflicker.types';
import FleaflickerPlayerCard from './FleaflickerPlayerCard.vue';
import FleaflickerPlayerTable from './FleaflickerPlayerTable.vue';

const { roster, isLoading, isLinked, error } = defineProps<{
  roster: IFleaflickerRoster | null;
  isLoading: boolean;
  isLinked: boolean;
  error: string | null;
}>();

const route = useRoute();
const { activeProfile } = storeToRefs(useActiveProfileStore());

const isViewingOwnTeam = computed(() => {
  const raw = route.query.teamId;
  const val = Array.isArray(raw) ? raw[0] : raw;
  const teamId = val ? Number(val) : null;
  const myTeamId = activeProfile.value?.fleaflicker?.teamId;
  return teamId === null || teamId === myTeamId;
});

type TViewMode = 'grid' | 'list';
const viewMode = ref<TViewMode>('grid');
const viewModeOptions = [
  { value: 'grid', icon: 'pi pi-th-large' },
  { value: 'list', icon: 'pi pi-list' }
];

const filterQuery = ref('');

const GROUP_LABELS: Record<TFleaflickerGroup, string> = {
  START: 'Titulares',
  INJURED: 'Lesionados',
  TAXI: 'Taxi Squad'
};

function groupLabel(group: TFleaflickerGroup): string {
  return GROUP_LABELS[group] ?? group;
}

const POSITION_ORDER: Record<string, number> = {
  QB: 0,
  RB: 1,
  'RB/WR/TE': 2,
  WR: 3,
  TE: 4,
  CB: 5,
  S: 6,
  IL: 7,
  EDGE: 8,
  LB: 9,
  BN: 10,
  IR: 11,
  TAXI: 12
};

const allSlots = computed<IFleaflickerFlatSlot[]>(() => {
  if (!roster) return [];
  return roster.groups.flatMap((g) =>
    g.slots.map((s) => ({
      ...s,
      slotLabel: s.position.label,
      groupLabel: groupLabel(g.group),
      slotOrder: POSITION_ORDER[s.position.label] ?? 99,
      positionOrder: POSITION_ORDER[s.leaguePlayer?.proPlayer.position ?? ''] ?? 99
    }))
  );
});

function matchesFilter(slot: IFleaflickerFlatSlot, q: string): boolean {
  if (!q) return true;
  const p = slot.leaguePlayer?.proPlayer;
  return !!(
    p?.nameFull.toLowerCase().includes(q) ||
    p?.position.toLowerCase().includes(q) ||
    p?.proTeamAbbreviation.toLowerCase().includes(q)
  );
}

const filteredSlots = computed(() => {
  const q = filterQuery.value.trim().toLowerCase();
  return allSlots.value.filter((s) => matchesFilter(s, q));
});

const filteredGroups = computed(() => {
  const q = filterQuery.value.trim().toLowerCase();
  if (!roster) return [];
  return roster.groups
    .map((g) => ({
      ...g,
      slots: g.slots.filter((s) =>
        matchesFilter(
          {
            ...s,
            slotLabel: s.position.label,
            groupLabel: groupLabel(g.group),
            slotOrder: POSITION_ORDER[s.position.label] ?? 99,
            positionOrder: POSITION_ORDER[s.leaguePlayer?.proPlayer.position ?? ''] ?? 99
          },
          q
        )
      )
    }))
    .filter((g) => g.slots.length > 0);
});
</script>

<style scoped>
.roster-view {
  display: flex;
  flex-direction: column;
  gap: var(--xl-spacing);
}

.viewing-other-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-spacing);
  padding: var(--s-spacing) var(--m-spacing);
  border-radius: var(--m-border-radius);
  background: color-mix(in srgb, var(--p-primary-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--p-primary-color) 30%, transparent);
  font-size: var(--s-font-size);
  color: var(--p-primary-color);

  a {
    text-decoration: none;
    flex-shrink: 0;
  }
}

.roster-controls {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
}

.roster-filter {
  flex: 1;
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
</style>
