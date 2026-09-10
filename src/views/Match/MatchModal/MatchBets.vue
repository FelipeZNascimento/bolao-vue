<template>
  <div class="match-bets">
    <div class="bets-grid">
      <!-- Away side -->
      <div class="bets-side bets-side--away">
        <div class="columns-row">
          <BetsColumn
            :bets="match.bets"
            :activeUserBet="match.loggedUserBets"
            :columnValue="BETS_VALUES.AWAY_EASY"
            :correctBets="correctBets"
          />
          <BetsColumn
            :bets="match.bets"
            :activeUserBet="match.loggedUserBets"
            :columnValue="BETS_VALUES.AWAY_HARD"
            :correctBets="correctBets"
          />
        </div>
      </div>

      <!-- Home side -->
      <div class="bets-side bets-side--home">
        <div class="columns-row">
          <BetsColumn
            :bets="match.bets"
            :activeUserBet="match.loggedUserBets"
            :columnValue="BETS_VALUES.HOME_HARD"
            :correctBets="correctBets"
          />
          <BetsColumn
            :bets="match.bets"
            :activeUserBet="match.loggedUserBets"
            :columnValue="BETS_VALUES.HOME_EASY"
            :correctBets="correctBets"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BETS_VALUES } from '@/constants/bets';
import type { IMatch } from '@/stores/matches.types';
import { type CorrectBets } from '@/util/betsCalculator';
import BetsColumn from '@/views/Match/BetsColumn.vue';

defineProps<{
  match: IMatch;
  correctBets: CorrectBets;
}>();
</script>

<style lang="scss" scoped>
.match-bets {
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

.bets-grid {
  display: flex;
  gap: 0;

  @media (max-width: 575px) {
    flex-direction: column;
  }
}

.bets-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  min-width: 0;
}

.bets-side--away .side-label {
  border-color: v-bind('match.away.background');
}

.bets-side--home .side-label {
  border-color: v-bind('match.home.background');
}

.columns-row {
  display: flex;
  flex: 1;
  min-width: 0;
}
</style>
