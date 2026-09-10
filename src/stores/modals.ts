import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from './activeProfile.types';
import type { IFleaflickerLeaguePlayer, IFleaflickerMatchPayload, IFleaflickerNews } from './fleaflicker.types';

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
  UserTracking = 'userTracking',
  FleaflickerMatch = 'fleaflickerMatch'
}

export type TUserPayload = Pick<IUser, 'color' | 'icon' | 'id' | 'isOnline' | 'name'>;

export type TModalPayload =
  | number
  | IFleaflickerNews
  | IFleaflickerLeaguePlayer
  | IFleaflickerMatchPayload
  | TUserPayload;

export const useModalsStore = defineStore('modals', () => {
  const currentModal = ref<EModal | null>(null);
  const modalPayload = ref<TModalPayload[]>([]);

  function openModal(modal: EModal, payload?: TModalPayload[]) {
    currentModal.value = modal;
    modalPayload.value = payload ?? [];
  }

  function closeModal() {
    currentModal.value = null;
    modalPayload.value = [];
  }

  return {
    currentModal,
    modalPayload,
    openModal,
    closeModal
  };
});
