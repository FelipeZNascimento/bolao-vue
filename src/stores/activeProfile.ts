import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UpdateProfileResponse {
  changedPassword: boolean;
  changedUser: number;
  user: User;
}

export interface User {
  color: string;
  email: string;
  fullName: string;
  icon: string;
  id: number;
  isOnline: boolean;
  name: string;
  status: number;
}

export const useActiveProfileStore = defineStore('activeProfile', () => {
  const activeProfile = ref<null | User>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  function setLoading(loadingState: boolean) {
    isLoading.value = loadingState;
  }

  function setActiveProfile(profile: null | User) {
    activeProfile.value = profile;
    isLoading.value = false;
  }

  function setError(newError: Error | null) {
    error.value = newError;
  }

  return { activeProfile, error, isLoading, setActiveProfile, setError, setLoading };
});
