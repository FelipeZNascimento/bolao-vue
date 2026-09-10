<template>
  <PrimeDialog
    v-if="match"
    :closable="isMobileOnly ? false : true"
    v-model:visible="isVisible"
    :draggable="false"
    :style="{ width: '1024px', height: '80vh' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
    :pt="dialogPt"
    contentClass="content-class"
    dismissableMask
    modal
  >
    <template #header>
      <ClockComponent
        :match="match"
        :ribbon="ribbon"
        fluid
      />
    </template>

    <PrimeTabs
      v-model:value="activeTab"
      :pt="{
        root: { style: 'display: flex; flex-direction: column; flex: 1; min-height: 0;' },
        panels: { style: 'flex: 1; min-height: 0; display: flex; flex-direction: column;' }
      }"
    >
      <PrimeTabList
        class="modal-tab-list"
        v-if="isMatchStarted"
      >
        <PrimeTab
          v-if="activeProfile && isMatchStarted"
          value="apostas"
          class="modal-tab"
        >
          <FontAwesomeIcon
            :style="{ color: activeProfile.color }"
            :icon="activeProfile.icon"
          />
          <span v-if="!isMobileOnly">Apostas</span>
        </PrimeTab>
        <PrimeTab
          value="ficha"
          class="modal-tab"
        >
          <i
            class="pi pi-info-circle"
            :class="{ 'tab-icon-only': isMobileOnly }"
            v-tooltip.bottom="isMobileOnly ? 'Ficha Técnica' : undefined"
          />
          <span v-if="!isMobileOnly">Ficha Técnica</span>
        </PrimeTab>
        <PrimeTab
          v-if="isMatchStarted"
          value="drives"
          class="modal-tab"
        >
          <i
            class="pi pi-list"
            :class="{ 'tab-icon-only': isMobileOnly }"
            v-tooltip.bottom="isMobileOnly ? 'Drives' : undefined"
          />
          <span v-if="!isMobileOnly">Drives</span>
        </PrimeTab>
        <PrimeTab
          v-if="isMatchStarted"
          value="estatisticas"
          class="modal-tab"
        >
          <i
            class="pi pi-chart-bar"
            :class="{ 'tab-icon-only': isMobileOnly }"
            v-tooltip.bottom="isMobileOnly ? 'Estatísticas' : undefined"
          />
          <span v-if="!isMobileOnly">Estatísticas</span>
        </PrimeTab>
      </PrimeTabList>
      <div class="tab-subheader">
        <ScoreComponent
          :match="match"
          :activeUserBet="match.loggedUserBets"
          :isMatchStarted="isMatchStarted"
          :ribbon="ribbon"
        />
      </div>
      <PrimeTabPanels ref="tabPanelsRef">
        <PrimeTabPanel value="apostas">
          <MatchBets
            :match="match"
            :correctBets="correctBets"
          />
        </PrimeTabPanel>
        <PrimeTabPanel value="ficha">
          <MatchInfoTab
            :summary="summary"
            :isLoading="isSummaryLoading"
            :error="summaryError"
          />
        </PrimeTabPanel>
        <PrimeTabPanel value="drives">
          <DrivesTab
            :homeTeam="match.home"
            :awayTeam="match.away"
            :summary="summary"
            :isLoading="isSummaryLoading"
            :error="summaryError"
          />
        </PrimeTabPanel>
        <PrimeTabPanel value="estatisticas">
          <StatsTab
            :summary="summary"
            :isLoading="isSummaryLoading"
            :error="summaryError"
            :awayAlias="match.away.alias"
            :homeAlias="match.home.alias"
          />
        </PrimeTabPanel>
      </PrimeTabPanels>
    </PrimeTabs>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useActiveProfileStore } from '@/stores/activeProfile.ts';
import { useClockStore } from '@/stores/clock';
import { useMatchesStore } from '@/stores/matches';
import { useMatchSummaryStore } from '@/stores/matchSummary';
import { useModalsStore } from '@/stores/modals';
import { calculateCorrectBets, calculateRibbon } from '@/util/betsCalculator';
import ClockComponent from '@/views/Match/ClockComponent.vue';
import ScoreComponent from '@/views/Match/ScoreComponent.vue';
import DrivesTab from './DrivesTab.vue';
import MatchBets from './MatchBets.vue';
import MatchInfoTab from './MatchInfoTab.vue';
import StatsTab from './StatsTab.vue';

defineProps<{
  isOpen: boolean;
  handleCloseModal: () => void;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const { closeModal } = useModalsStore();
const { modalPayload } = storeToRefs(useModalsStore());
const { matches } = storeToRefs(useMatchesStore());
const { activeProfile } = storeToRefs(useActiveProfileStore());

const matchSummaryStore = useMatchSummaryStore();
const { summary, isLoading: isSummaryLoading, error: summaryError } = storeToRefs(matchSummaryStore);

const dialogPt = computed(() => ({
  content: { style: 'flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column;' },
  root: { style: 'display: flex; flex-direction: column;' }
}));

const TAB_ORDER = ['apostas', 'ficha', 'drives', 'estatisticas'] as const;

const activeTab = ref<(typeof TAB_ORDER)[number]>('ficha');
const tabPanelsRef = ref<{ $el: HTMLElement } | null>(null);
let swipeStartX = 0;

function onSwipeStart(e: TouchEvent) {
  swipeStartX = e.touches[0].clientX;
}

function animateActivePanel(dir: 'left' | 'right') {
  const el = tabPanelsRef.value?.$el;
  if (!el) return;
  // Wait one tick for PrimeVue to swap the active panel
  requestAnimationFrame(() => {
    const panel = el.querySelector<HTMLElement>('[data-p-active="true"]');
    if (!panel) return;
    const fromX = dir === 'left' ? '40px' : '-40px';
    panel.animate(
      [
        { transform: `translateX(${fromX})`, opacity: '0' },
        { transform: 'translateX(0)', opacity: '1' }
      ],
      {
        duration: 280,
        easing: 'ease',
        fill: 'backwards'
      }
    );
  });
}

function onSwipeEnd(e: TouchEvent) {
  const delta = swipeStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) < 50) return;
  const currentIndex = TAB_ORDER.indexOf(activeTab.value);
  if (delta > 0 && currentIndex < TAB_ORDER.length - 1) {
    activeTab.value = TAB_ORDER[currentIndex + 1];
    animateActivePanel('left');
  } else if (delta < 0 && currentIndex > 0) {
    activeTab.value = TAB_ORDER[currentIndex - 1];
    animateActivePanel('right');
  }
}

watch(tabPanelsRef, (newRef, oldRef) => {
  const oldEl = oldRef?.$el;
  if (oldEl) {
    oldEl.removeEventListener('touchstart', onSwipeStart);
    oldEl.removeEventListener('touchend', onSwipeEnd);
  }
  const newEl = newRef?.$el;
  if (newEl) {
    newEl.addEventListener('touchstart', onSwipeStart, { passive: true });
    newEl.addEventListener('touchend', onSwipeEnd, { passive: true });
  }
});
const matchId = computed(() => modalPayload.value[0] as number | undefined);

const isVisible = computed({
  get: () => matchId.value !== undefined,
  set: (val) => {
    if (!val) closeModal();
  }
});

const match = computed(() => matches.value.find((m) => m.id === matchId.value));
const isMatchStarted = computed(() => !!match.value && clockStore.currentTimestamp >= match.value.timestamp);
const correctBets = computed(() => calculateCorrectBets(match.value?.away.score ?? 0, match.value?.home.score ?? 0));
const ribbon = computed(() =>
  calculateRibbon(correctBets.value, match.value?.loggedUserBets?.value, isMatchStarted.value ?? false)
);

watch(
  match,
  (newMatch) => {
    if (!newMatch) {
      matchSummaryStore.reset();
      activeTab.value = 'ficha';
      return;
    }
    activeTab.value = isMatchStarted.value && activeProfile.value ? 'apostas' : 'ficha';
    matchSummaryStore.fetch(newMatch.espnId, newMatch.status);
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.modal-tab-list {
  border-bottom: 1px solid var(--bolao-c-grey5);
  flex-shrink: 0;
}
.modal-tab {
  display: flex;
  flex: 1;
  justify-content: center;
}

:deep(.p-tabpanels) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.p-tabpanel) {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.tab-icon-only {
  font-size: var(--m-font-size);
}

.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
  flex: 1;
  min-height: 0;
}
</style>
