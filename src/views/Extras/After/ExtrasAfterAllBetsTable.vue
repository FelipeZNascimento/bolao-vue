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
            <TeamComponent
              isScoreless
              :isAlias="true"
              :isGridMode="false"
              :team="slotProps.data.team"
            />
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
            <PrimeOverlayBadge severity="secondary" :value="slotProps.data.bets.wildcard.length">
              <i
                :class="{
                  highlight: isHighlighted(correctBetsByCategory.wildcard, slotProps.data.team.id),
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
            <PrimeOverlayBadge severity="secondary" :value="slotProps.data.bets.division.length">
              <i
                :class="{
                  highlight: isHighlighted(correctBetsByCategory.division, slotProps.data.team.id),
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
            <PrimeOverlayBadge severity="secondary" :value="slotProps.data.bets.conference.length">
              <i
                :class="{
                  highlight: isHighlighted(
                    correctBetsByCategory.conference,
                    slotProps.data.team.id,
                  ),
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
            <PrimeOverlayBadge severity="secondary" :value="slotProps.data.bets.superbowl.length">
              <i
                :class="{
                  highlight:
                    correctBetsByCategory.superbowl &&
                    correctBetsByCategory.superbowl.id === slotProps.data.team.id,
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
    :bets="modalInfo.bets"
    :handleCloseModal="handleCloseModal"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import TeamComponent from '@/components/Match/TeamComponent.vue';
import {
  type BetByCategory,
  type Conference,
  type ExtrasTeam,
  useExtraBetStore,
  type UserBetByTeam,
} from '@/stores/extraBet';

import ExtrasBetsModal from './ExtrasBetsModal.vue';

defineProps<{
  conference: Conference;
  teamsWithBets: UserBetByTeam[];
  title?: string;
}>();

// ------ Types ------
type ModalInfo = {
  bets: BetByCategory | null;
  team: ExtrasTeam | null;
};

// ------ Refs ------
const modalInfo = ref<ModalInfo>({ bets: null, team: null });

// ------ Initialization ------
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const correctBetsByCategory = computed(() => extraBetStore.correctBetsByCategory);

// ------ Functions ------
function handleCloseModal() {
  modalInfo.value.bets = null;
  modalInfo.value.team = null;
}

function isHighlighted(winnersList: ExtrasTeam[], teamId: number) {
  return winnersList.find((winner) => winner.id === teamId);
}

function onRowClick(event) {
  modalInfo.value = { ...event.data } as ModalInfo;
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
