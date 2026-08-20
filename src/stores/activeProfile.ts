import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from './activeProfile.types';

export const useActiveProfileStore = defineStore('activeProfile', () => {
  const activeProfile = ref<IUser | null>(null);
  const isLoading = ref(false);
  const isFavoriteUpdating = ref(false);
  const error = ref<Error | null>(null);
  const isSeasonRegisterModalOpen = ref(false);

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

  return {
    activeProfile,
    closeSeasonRegisterModal,
    error,
    isFavoriteUpdating,
    isLoading,
    isSeasonRegisterModalOpen,
    openSeasonRegisterModal,
    setActiveProfile,
    setError,
    setFavoriteUpdating,
    setFavorites,
    setLoading
  };
});
