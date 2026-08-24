<template>
  <div class="standings-view">
    <div
      v-if="isLoading"
      class="state-message"
    >
      <i class="pi pi-spinner pi-spin" />
      Carregando classificação...
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

    <template v-else-if="standings">
      <div
        v-for="division in standings.divisions"
        :key="division.id"
        class="division-section"
      >
        <h2
          v-if="division.name"
          class="division-title"
        >
          {{ division.name }}
        </h2>

        <PrimeDataTable
          :value="division.teams"
          size="small"
          stripedRows
        >
          <PrimeColumn
            header="#"
            style="width: 2rem"
          >
            <template #body="{ index }">
              <span class="rank">{{ index + 1 }}</span>
            </template>
          </PrimeColumn>

          <PrimeColumn header="Time">
            <template #body="{ data }">
              <RouterLink
                :to="{ path: '/fleaflicker', query: { tab: 'roster', teamId: data.id } }"
                class="team-cell team-cell--link"
              >
                <img
                  v-if="data.logoUrl"
                  :src="data.logoUrl"
                  :alt="data.name"
                  class="team-logo"
                />
                <span
                  v-else
                  class="team-initials"
                  >{{ data.initials }}</span
                >
                <div class="team-info">
                  <span class="team-name">{{ data.name }}</span>
                  <span
                    v-if="data.owners.length"
                    class="team-owner"
                    >{{ data.owners[0].displayName }}</span
                  >
                </div>
                <i class="pi pi-angle-right team-cell-arrow" />
              </RouterLink>
            </template>
          </PrimeColumn>

          <PrimeColumn
            field="recordOverall.formatted"
            style="width: 5rem; text-align: center"
          >
            <template #header><span style="width: 100%; text-align: center">W-L</span></template>
            <template #body="{ data }">
              <span class="record">{{ data.recordOverall.formatted }}</span>
            </template>
          </PrimeColumn>

          <PrimeColumn style="width: 5rem">
            <template #header><span style="width: 100%; text-align: center">Pts F</span></template>
            <template #body="{ data }">
              <span class="pts">{{ data.pointsFor.formatted }}</span>
            </template>
          </PrimeColumn>

          <PrimeColumn style="width: 5rem">
            <template #header><span style="width: 100%; text-align: center">Pts C</span></template>
            <template #body="{ data }">
              <span class="pts">{{ data.pointsAgainst.formatted }}</span>
            </template>
          </PrimeColumn>

          <PrimeColumn style="width: 4rem">
            <template #header><span style="width: 100%; text-align: center">Seq.</span></template>
            <template #body="{ data }">
              <span class="streak">{{ data.streak?.formatted ?? '—' }}</span>
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import type { IFleaflickerStandings } from '@/stores/fleaflicker.types';

const { standings, isLoading, isLinked, error } = defineProps<{
  standings: IFleaflickerStandings | null;
  isLoading: boolean;
  isLinked: boolean;
  error: string | null;
}>();
</script>
<style scoped>
.standings-view {
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

.division-section {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.division-title {
  font-size: var(--l-font-size);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: light-dark(var(--bolao-c-grey5), var(--bolao-c-grey3));
}

.team-cell {
  display: flex;
  align-items: center;
  gap: var(--s-spacing);

  &.team-cell--link {
    text-decoration: none;
    color: inherit;
    border-radius: var(--s-border-radius);
    transition: opacity 0.15s;

    &:hover {
      opacity: 0.75;

      .team-cell-arrow {
        opacity: 1;
      }
    }
  }
}

.team-cell-arrow {
  margin-left: auto;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.15s;
  color: var(--bolao-c-grey4);
}

.team-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 50%;
  flex-shrink: 0;
}

.team-initials {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: light-dark(var(--bolao-c-grey2), var(--bolao-c-grey6));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--xs-font-size);
  font-weight: 600;
  flex-shrink: 0;
}

.team-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.team-name {
  font-weight: 500;
  font-size: var(--s-font-size);
}

.team-owner {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
}

.rank {
  font-weight: 600;
  color: var(--bolao-c-grey4);
}

.record {
  font-variant-numeric: tabular-nums;
}

.pts,
.streak {
  font-variant-numeric: tabular-nums;
  text-align: center;
  display: block;
}
</style>
