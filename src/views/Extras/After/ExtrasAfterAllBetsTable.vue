<template>
  <div class="outer-extras-result-table">
    <PrimeDataTable
      showGridlines
      rowHover
      tableClass="extras-table"
      :value="teamsWithBets"
      dataKey="id"
      size="small"
      @rowClick="onRowClick"
    >
      <template v-if="title" #header>
        <div>
          <h2>{{ title }}</h2>
        </div>
      </template>
      <PrimeColumn field="name">
        <template #body="slotProps">
          <div class="team-line-outer">
            <TeamComponent isScoreless :isAlias="true" :isGridMode="false" :team="slotProps.data.team" />
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn field="wc">
        <template #header>
          <div class="team-line-outer" style="width: 100%">
            <div class="spacer" v-tooltip.top="'Wild Card'">WC</div>
          </div>
        </template>
        <template #body="slotProps">
          <div class="team-line-outer">
            <PrimeOverlayBadge severity="secondary" :value="countByType(slotProps.data.bets, 'wildcard')">
              <i
                :class="{
                  highlight: isHighlighted(extraBetsResults?.bets ?? [], slotProps.data.team.id, 'wildcard'),
                }"
                class="pi pi-star-fill star-icon orange-star"
                v-tooltip.top="'Wild Card'"
              ></i>
            </PrimeOverlayBadge>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn field="division">
        <template #header>
          <div class="team-line-outer" style="width: 100%">
            <div class="spacer" v-tooltip.top="'Campeão Divisão'">Div</div>
          </div>
        </template>
        <template #body="slotProps">
          <div class="team-line-outer">
            <PrimeOverlayBadge severity="secondary" :value="countByType(slotProps.data.bets, 'division')">
              <i
                :class="{
                  highlight: isHighlighted(extraBetsResults?.bets ?? [], slotProps.data.team.id, 'division'),
                }"
                class="pi pi-crown crown-icon golden-crown"
                v-tooltip.top="'Divisão'"
              ></i>
            </PrimeOverlayBadge>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn field="conference">
        <template #header>
          <div class="team-line-outer" style="width: 100%">
            <div class="spacer" v-tooltip.top="'Campeão Conferência'">Conf</div>
          </div>
        </template>

        <template #body="slotProps">
          <div class="team-line-outer">
            <PrimeOverlayBadge severity="secondary" :value="countByType(slotProps.data.bets, 'conference')">
              <i
                :class="{
                  highlight: isHighlighted(extraBetsResults?.bets ?? [], slotProps.data.team.id, 'conference'),
                }"
                class="pi pi-sparkles sparkles-icon blue-sparkles"
                v-tooltip.top="'Conferência'"
              ></i>
            </PrimeOverlayBadge>
          </div>
        </template>
      </PrimeColumn>
      <PrimeColumn field="superbowl">
        <template #header>
          <div class="team-line-outer" style="width: 100%">
            <div class="spacer" v-tooltip.top="'Vencedor Super Bowl'">SB</div>
          </div>
        </template>

        <template #body="slotProps">
          <div class="team-line-outer">
            <PrimeOverlayBadge severity="secondary" :value="countByType(slotProps.data.bets, 'superbowl')">
              <i
                :class="{
                  highlight: isHighlighted(extraBetsResults?.bets ?? [], slotProps.data.team.id, 'conference'),
                }"
                class="pi pi-trophy trophy-icon mint-trophy"
                v-tooltip.top="'Superbowl'"
              ></i>
            </PrimeOverlayBadge>
          </div>
        </template>
      </PrimeColumn>
    </PrimeDataTable>
  </div>
  <ExtrasBetsModal
    :team="modalInfo.team"
    :teamWithExtras="modalInfo.teamsWithExtras"
    :handleCloseModal="handleCloseModal"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import type {
  IExtraBetBet,
  ITeamWithExtras,
  ITeamWithExtrasBet,
  TConference,
  TExtrasTeam,
} from '@/stores/extraBet.types';

import TeamComponent from '@/components/Match/TeamComponent.vue';
import { EXTRA_BETS_VALUES } from '@/constants/bets';
import { useExtraBetStore } from '@/stores/extraBet';

import ExtrasBetsModal from './ExtrasBetsModal.vue';

const props = defineProps<{
  conference: TConference;
  teamsWithBets: ITeamWithExtras[];
  title?: string;
}>();

// ------ Types ------

type ModalInfo = {
  team: null | TExtrasTeam;
  teamsWithExtras: ITeamWithExtrasBet[];
};

// ------ Refs ------

const modalInfo = ref<ModalInfo>({ team: null, teamsWithExtras: [] });

// ------ Initialization ------

const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------

const extraBetsResults = computed(() => extraBetStore.extraBetsResults);

// ------ Functions ------

function countByType(betsArray: ITeamWithExtrasBet[], type: 'conference' | 'division' | 'superbowl' | 'wildcard') {
  if (type === 'conference') {
    return betsArray.filter((bet) => bet.type === EXTRA_BETS_VALUES[props.conference]).length;
  } else if (type === 'division') {
    const divisions = [
      EXTRA_BETS_VALUES[`${props.conference}_EAST`],
      EXTRA_BETS_VALUES[`${props.conference}_NORTH`],
      EXTRA_BETS_VALUES[`${props.conference}_SOUTH`],
      EXTRA_BETS_VALUES[`${props.conference}_WEST`],
    ];
    return betsArray.filter((bet) => divisions.includes(bet.type)).length;
  } else if (type === 'superbowl') {
    return betsArray.filter((bet) => bet.type === EXTRA_BETS_VALUES.SUPERBOWL).length;
  } else if (type === 'wildcard') {
    return betsArray.filter((bet) => bet.type === EXTRA_BETS_VALUES[`${props.conference}_WILDCARD`]).length;
  }
}

function handleCloseModal() {
  modalInfo.value.teamsWithExtras = [];
  modalInfo.value.team = null;
}

function isHighlighted(
  winnersList: IExtraBetBet[],
  teamId: number,
  type: 'conference' | 'division' | 'superbowl' | 'wildcard',
) {
  if (type === 'conference') {
    return winnersList.find(
      (winner) => winner.teams[0].id === teamId && winner.type === EXTRA_BETS_VALUES[props.conference],
    );
  } else if (type === 'division') {
    const divisions = [
      EXTRA_BETS_VALUES[`${props.conference}_EAST`],
      EXTRA_BETS_VALUES[`${props.conference}_NORTH`],
      EXTRA_BETS_VALUES[`${props.conference}_SOUTH`],
      EXTRA_BETS_VALUES[`${props.conference}_WEST`],
    ];
    return winnersList.find((winner) => winner.teams[0].id === teamId && divisions.includes(winner.type));
  } else if (type === 'superbowl') {
    return winnersList.find((winner) => winner.teams[0].id === teamId && winner.type === EXTRA_BETS_VALUES.SUPERBOWL);
  } else if (type === 'wildcard') {
    return winnersList.find(
      (winner) => winner.teams[0].id === teamId && winner.type === EXTRA_BETS_VALUES[`${props.conference}_WILDCARD`],
    );
  }
}

function onRowClick(event: any) {
  const eventDate = event.data as ITeamWithExtras;
  modalInfo.value = {
    team: eventDate.team,
    teamsWithExtras: eventDate.bets,
  };
}
</script>
<style lang="scss">
.outer-extras-result-table {
  min-width: 400px;
  width: 400px;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (max-width: 767px) {
    width: 100%;
    min-width: 100%;
  }

  .extras-table {
    @media (max-width: 767px) {
      min-width: 100%;
      width: 100%;
    }

    @media (min-width: 768px) {
      min-width: 400px;
    }
  }

  .team-line-outer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--xs-spacing);
    cursor: pointer;
  }

  // .p-datatable {
  //   width: 100%;
  //   overflow-x: hidden !important;
  // }

  // .p-datatable-header-cell {
  //   padding: 0 !important;
  // }

  // .p-datatable-tbody > tr > td {
  //   padding: 0 !important;
  // }

  .spacer {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .crown-icon,
  .star-icon,
  .trophy-icon,
  .sparkles-icon {
    transition: all 0.2s;
    color: var(--color-text);
  }

  .golden-crown,
  .orange-star,
  .mint-trophy,
  .blue-sparkles {
    color: var(--color-text);
    padding: var(--s-spacing);
    font-size: var(--l-font-size);
  }

  .golden-crown {
    color: var(--bolao-c-gold);
  }

  .orange-star {
    color: var(--bolao-c-orange);
  }

  .mint-trophy {
    color: var(--bolao-c-mint);
  }

  .blue-sparkles {
    color: var(--bolao-c-sky);
  }

  .highlight {
    box-shadow: 0px 0px 1px 1px rgba(white, 0.75) inset;
    -webkit-box-shadow: 0px 0px 1px 2px rgba(white, 0.75) inset;
    -moz-box-shadow: 0px 0px 1px 1px rgba(white, 0.75) inset;
    background-color: var(--bolao-c-mint-t1);
  }
}
</style>
