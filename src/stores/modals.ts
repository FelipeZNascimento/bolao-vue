import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from './activeProfile.types';

export const useModalsStore = defineStore('modals', () => {
  // ── Season Register Modal ──
  const isSeasonRegisterModalOpen = ref(false);

  function openSeasonRegisterModal() {
    isSeasonRegisterModalOpen.value = true;
  }

  function closeSeasonRegisterModal() {
    isSeasonRegisterModalOpen.value = false;
  }

  // ── User Tracking Modal ──
  const isUserTrackingModalOpen = ref(false);
  const selectedUserTracking = ref<IUser | null>(null);

  function openUserTrackingModal(user: IUser) {
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
    isUserTrackingModalOpen,
    selectedUserTracking,
    openUserTrackingModal,
    closeUserTrackingModal
  };
});
