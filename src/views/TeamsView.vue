<template>
  <div class="teams-page">
    <div
      v-if="isLoading"
      class="teams-grid"
    >
      <PrimeSkeleton
        v-for="n in 32"
        :key="n"
        class="team-skeleton"
      />
    </div>

    <p
      v-else-if="!sortedTeams.length"
      class="empty-state"
    >
      Nenhuma equipe disponível.
    </p>

    <div
      v-else
      class="teams-grid"
    >
      <RouterLink
        v-for="team in sortedTeams"
        :key="team.id"
        :to="`/teams/${team.id}`"
        class="team-card"
        :style="{
          '--team-bg': `#${team.background}`,
          '--team-fg': `#${team.foreground}`
        }"
      >
        <div class="team-card-logo-wrap">
          <img
            :src="`/team_logos/${team.id}.gif`"
            :alt="team.name"
            class="team-card-logo"
          />
        </div>
        <div class="team-card-body">
          <span class="team-card-location">{{ team.name.split(' ').slice(0, -1).join(' ') }}</span>
          <span class="team-card-name">{{ team.name.split(' ').slice(-1)[0] }}</span>
          <span class="team-card-badge">{{ team.conference }} · {{ team.division }}</span>
        </div>
        <div
          class="team-card-accent"
          :style="{ background: `#${team.background}` }"
        />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useTeamsStore } from '@/stores/teams';

const teamsStore = useTeamsStore();
const { isLoading, teams } = storeToRefs(teamsStore);
const sortedTeams = computed(() => teams.value.slice().sort((a, b) => a.name.localeCompare(b.name)));
</script>

<style lang="scss" scoped>
.teams-page {
  padding: var(--l-spacing) var(--xl-spacing);
  max-width: var(--page-width);
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: var(--m-spacing) var(--s-spacing);
  }
}

.teams-header {
  margin-bottom: var(--l-spacing);
}

.teams-title {
  font-size: var(--xl-font-size);
  font-weight: 800;
  color: var(--color-heading);
}

.teams-subtitle {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
  margin-top: var(--xxs-spacing);
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--m-spacing);

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.team-skeleton {
  height: 200px !important;
}

.team-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--xs-spacing);
  padding: var(--m-spacing) var(--s-spacing) var(--s-spacing);
  background: var(--color-background-soft);
  border: 1px solid var(--bolao-c-grey2-t1);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition:
    transform 0.18s,
    border-color 0.18s,
    box-shadow 0.18s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--team-bg, var(--bolao-c-sky));
    box-shadow: 0 8px 24px color-mix(in srgb, var(--team-bg, #0004) 30%, transparent);

    .team-card-logo {
      transform: scale(1.08);
    }
  }
}

.team-card-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0.85;
}

.team-card-logo-wrap {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-card-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s;
  filter: drop-shadow(0 2px 6px #0003);
}

.team-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}

.team-card-location {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey4);
  line-height: 1.2;
}

.team-card-name {
  font-size: var(--m-font-size);
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.team-card-badge {
  margin-top: var(--xxs-spacing);
  font-size: var(--xxs-font-size);
  color: var(--team-fg, var(--bolao-c-grey2));
  background: var(--team-bg, var(--bolao-c-grey2-t1));
  padding: 2px 8px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.empty-state {
  color: var(--bolao-c-grey4);
  font-size: var(--s-font-size);
}
</style>
