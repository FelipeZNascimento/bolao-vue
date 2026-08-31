import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from './activeProfile.types';
import type { IFleaflickerLeaguePlayer, IFleaflickerNews } from './fleaflicker.types';

export enum EModal {
  SeasonRegister = 'seasonRegister',
  Login = 'login',
  Match = 'match',
  Profile = 'profile',
  Password = 'password',
  Preferences = 'preferences',
  Config = 'config',
  PlayerNews = 'playerNews',
  ProjectedStats = 'projectedStats',
  UserTracking = 'userTracking'
}

export type TUserPayload = Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'>;

export type TModalPayload = number | IFleaflickerNews | IFleaflickerLeaguePlayer | TUserPayload;

export const useModalsStore = defineStore('modals', () => {
  const currentModal = ref<EModal | null>(null);
  const modalPayload = ref<TModalPayload | null>(null);

  function openModal(modal: EModal, payload?: TModalPayload) {
    currentModal.value = modal;
    modalPayload.value = payload ?? null;
  }

  function closeModal() {
    currentModal.value = null;
    modalPayload.value = null;
  }

  return {
    currentModal,
    modalPayload,
    openModal,
    closeModal
  };
});
