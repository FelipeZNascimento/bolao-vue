import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TMatchStatus } from '@/constants/match_status';
import ApiService from '@/services/api_request';
import type { IMatchSummary } from './matchSummary.type';

const apiService = new ApiService();

export const useMatchSummaryStore = defineStore('matchSummary', () => {
  const summary = ref<IMatchSummary | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetch(espnId: number, status: TMatchStatus, isSilent = false) {
    if (!isSilent) {
      summary.value = null;
      isLoading.value = true;
    }
    error.value = null;
    try {
      summary.value = await apiService.post<IMatchSummary>(`match/more-info/${espnId}`, { status });
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar informações do jogo.';
    } finally {
      isLoading.value = false;
    }
  }

  function reset() {
    summary.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return { error, fetch, isLoading, reset, summary };
});
