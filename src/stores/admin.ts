import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from './activeProfile.types';
import type { IAdminCacheEntry, IAdminCacheStats } from './admin.types';

export const useAdminStore = defineStore('admin', () => {
  // ── Users ──────────────────────────────────────────────────────────────────
  const users = ref<IUser[]>([]);
  const usersLoading = ref(false);
  const usersError = ref<Error | null>(null);

  function setUsers(newUsers: IUser[]) {
    users.value = newUsers;
  }

  function updateUser(updated: IUser) {
    const idx = users.value.findIndex((u) => u.id === updated.id);
    if (idx !== -1) users.value[idx] = updated;
  }

  function setUsersLoading(v: boolean) {
    usersLoading.value = v;
  }

  function setUsersError(e: Error | null) {
    usersError.value = e;
  }

  // ── Cache ──────────────────────────────────────────────────────────────────
  const cacheKeys = ref<IAdminCacheEntry[]>([]);
  const cacheStats = ref<IAdminCacheStats | null>(null);
  const cacheLoading = ref(false);
  const cacheError = ref<Error | null>(null);

  function setCacheKeys(keys: IAdminCacheEntry[]) {
    cacheKeys.value = keys;
  }

  function setCacheStats(stats: IAdminCacheStats) {
    cacheStats.value = stats;
  }

  function setCacheLoading(v: boolean) {
    cacheLoading.value = v;
  }

  function setCacheError(e: Error | null) {
    cacheError.value = e;
  }

  return {
    cacheError,
    cacheKeys,
    cacheLoading,
    cacheStats,
    setCacheError,
    setCacheKeys,
    setCacheLoading,
    setCacheStats,
    setUsers,
    setUsersError,
    setUsersLoading,
    updateUser,
    users,
    usersError,
    usersLoading
  };
});
