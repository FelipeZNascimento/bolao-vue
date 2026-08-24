import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from './activeProfile.types';
import type { IFleaflickerLeaguePlayer, IFleaflickerNews } from './fleaflicker.types';

export const useModalsStore = defineStore('modals', () => {
  // ── Season Register Modal ──
  const isSeasonRegisterModalOpen = ref(false);

  function openSeasonRegisterModal() {
    isSeasonRegisterModalOpen.value = true;
  }

  function closeSeasonRegisterModal() {
    isSeasonRegisterModalOpen.value = false;
  }

  // ── Login Modal ──
  const isLoginModalOpen = ref(false);

  function openLoginModal() {
    isLoginModalOpen.value = true;
  }

  function closeLoginModal() {
    isLoginModalOpen.value = false;
  }

  // ── Profile Modal ──
  const isProfileModalOpen = ref(false);

  function openProfileModal() {
    isProfileModalOpen.value = true;
  }

  function closeProfileModal() {
    isProfileModalOpen.value = false;
  }

  // ── Password Modal ──
  const isPasswordModalOpen = ref(false);

  function openPasswordModal() {
    isPasswordModalOpen.value = true;
  }

  function closePasswordModal() {
    isPasswordModalOpen.value = false;
  }

  // ── Preferences Modal ──
  const isPreferencesModalOpen = ref(false);

  function openPreferencesModal() {
    isPreferencesModalOpen.value = true;
  }

  function closePreferencesModal() {
    isPreferencesModalOpen.value = false;
  }

  // ── Config Modal ──
  const isConfigModalOpen = ref(false);

  function openConfigModal() {
    isConfigModalOpen.value = true;
  }

  function closeConfigModal() {
    isConfigModalOpen.value = false;
  }

  // ── Player News Modal ──
  const isPlayerNewsModalOpen = ref(false);
  const selectedPlayerNews = ref<IFleaflickerNews | null>(null);

  function openPlayerNewsModal(news: IFleaflickerNews) {
    selectedPlayerNews.value = news;
    isPlayerNewsModalOpen.value = true;
  }

  function closePlayerNewsModal() {
    isPlayerNewsModalOpen.value = false;
    selectedPlayerNews.value = null;
  }

  // ── Projected Stats Modal ──
  const isProjectedStatsModalOpen = ref(false);
  const selectedProjectedStats = ref<IFleaflickerLeaguePlayer | null>(null);

  function openProjectedStatsModal(player: IFleaflickerLeaguePlayer) {
    selectedProjectedStats.value = player;
    isProjectedStatsModalOpen.value = true;
  }

  function closeProjectedStatsModal() {
    isProjectedStatsModalOpen.value = false;
    selectedProjectedStats.value = null;
  }

  // ── User Tracking Modal ──
  const isUserTrackingModalOpen = ref(false);
  const selectedUserTracking = ref<Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'> | null>(null);

  function openUserTrackingModal(user: Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'>) {
    selectedUserTracking.value = user;
    isUserTrackingModalOpen.value = true;
  }

  function closeUserTrackingModal() {
    isUserTrackingModalOpen.value = false;
    selectedUserTracking.value = null;
  }

  return {
    isSeasonRegisterModalOpen,
    openSeasonRegisterModal,
    closeSeasonRegisterModal,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    isProfileModalOpen,
    openProfileModal,
    closeProfileModal,
    isPasswordModalOpen,
    openPasswordModal,
    closePasswordModal,
    isPreferencesModalOpen,
    openPreferencesModal,
    closePreferencesModal,
    isConfigModalOpen,
    openConfigModal,
    closeConfigModal,
    isPlayerNewsModalOpen,
    selectedPlayerNews,
    openPlayerNewsModal,
    closePlayerNewsModal,
    isProjectedStatsModalOpen,
    selectedProjectedStats,
    openProjectedStatsModal,
    closeProjectedStatsModal,
    isUserTrackingModalOpen,
    selectedUserTracking,
    openUserTrackingModal,
    closeUserTrackingModal
  };
});
