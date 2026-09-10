<template>
  <div
    class="bets-column"
    :class="{
      'bullseye-col': isBullseyeColumn,
      'half-col': isHalfBetColumn,
      'miss-col': isMissColumn
    }"
  >
    <p class="bets-column-header">
      <i
        class="header-icon pi"
        :class="headerIcon"
      />
      {{ BETS_LABELS[columnValue] }}
    </p>
    <!-- Render active user bet first -->
    <div
      class="bets-line"
      :style="{
        boxShadow: `inset 3px 0 0 ${activeUserBet.user.color}`,
        backgroundColor: `color-mix(in srgb, ${activeUserBet.user.color} 12%, transparent)`
      }"
      v-if="activeUserBet && activeUserBet?.value === columnValue"
      :key="activeUserBet.id"
    >
      <IconAndName
        isActive
        isClickable
        :user="activeUserBet.user"
        :showOnlineBadge="false"
        isShort
      />
    </div>
    <!-- Render remaining bets -->
    <div
      class="bets-line"
      v-for="bet in bets.filter((bet) => bet.value === columnValue)"
      :key="bet.id"
    >
      <IconAndName
        :user="bet.user"
        :isFavorite="activeProfile?.favorites?.includes(String(bet.user.id)) ?? false"
        isClickable
        :showOnlineBadge="false"
        isShort
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import IconAndName from '@/components/IconAndName.vue';
import { BETS_LABELS, type BetsValues } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile';
import type { IBet } from '@/stores/matches.types';
import { type CorrectBets, isBullseye, isHalfBet } from '@/util/betsCalculator';

const props = defineProps<{
  activeUserBet: IBet | null;
  bets: IBet[];
  columnValue: BetsValues;
  correctBets: CorrectBets;
}>();

// ------ Computed Properties ------
const { activeProfile } = storeToRefs(useActiveProfileStore());

const isBullseyeColumn = computed(() => isBullseye(props.correctBets, props.columnValue));
const isHalfBetColumn = computed(() => isHalfBet(props.correctBets, props.columnValue));
const isMissColumn = computed(() => !isBullseyeColumn.value && !isHalfBetColumn.value);
const headerIcon = computed(() => {
  if (isBullseyeColumn.value) return 'pi-bullseye';
  if (isHalfBetColumn.value) return 'pi-check-circle';
  return 'pi-times-circle';
});
</script>

<style lang="scss" scoped>
.bets-column {
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: var(--xs-spacing) 0;
}

.bullseye-col {
  background: linear-gradient(to bottom, var(--bolao-c-gold-t1) 0%, transparent 80%);

  .header-icon {
    color: var(--bolao-c-gold);
  }
}

.half-col {
  background: linear-gradient(to bottom, var(--bolao-c-blue-t1) 0%, transparent 80%);

  .header-icon {
    color: var(--bolao-c-blue);
  }
}

.miss-col {
  background: linear-gradient(to bottom, var(--bolao-c-red-t1) 0%, transparent 80%);

  .header-icon {
    color: var(--bolao-c-red);
  }
}

.bets-column-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--xs-spacing);
  text-align: center;
  width: 100%;
  font-size: var(--xs-font-size);
  font-weight: bold;
}

.bets-line {
  display: flex;
  padding: var(--xxs-spacing) 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  font-size: var(--xs-font-size);
  padding-left: var(--s-spacing);

  @media (max-width: 1023px) {
    font-size: var(--xxs-font-size);
  }
}
</style>
