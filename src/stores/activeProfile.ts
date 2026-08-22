import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from './activeProfile.types';

export type { IUser };

export const useActiveProfileStore = defineStore('activeProfile', () => {
  const activeProfile = ref<IUser | null>(null);
  const isLoading = ref(false);
  const isFavoriteUpdating = ref(false);
  const error = ref<Error | null>(null);
  const isSeasonRegisterModalOpen = ref(false);
  const isUserTrackingModalOpen = ref(false);
  const selectedUserTracking = ref<IUser | null>(null);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setFavoriteUpdating(loadingState: boolean) {
    isFavoriteUpdating.value = loadingState;
  }

  function setActiveProfile(profile: IUser | null) {
    activeProfile.value = profile;
    isLoading.value = false;
  }

  function setFavorites(favorites: string[]) {
    if (!activeProfile.value) return;
    activeProfile.value = { ...activeProfile.value, favorites };
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  function openSeasonRegisterModal() {
    isSeasonRegisterModalOpen.value = true;
  }

  function closeSeasonRegisterModal() {
    isSeasonRegisterModalOpen.value = false;
  }

  function openUserTrackingModal(user: IUser) {
    selectedUserTracking.value = user;
    isUserTrackingModalOpen.value = true;
  }

  function closeUserTrackingModal() {
    isUserTrackingModalOpen.value = false;
    selectedUserTracking.value = null;
  }

  return {
    activeProfile,
    closeSeasonRegisterModal,
    closeUserTrackingModal,
    error,
    isFavoriteUpdating,
    isLoading,
    isSeasonRegisterModalOpen,
    isUserTrackingModalOpen,
    openSeasonRegisterModal,
    openUserTrackingModal,
    selectedUserTracking,
    setActiveProfile,
    setError,
    setFavoriteUpdating,
    setFavorites,
    setLoading
  };
});
