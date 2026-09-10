import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
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

interface IModalEntry {
  modal: EModal;
  payload: TModalPayload[];
}

export const useModalsStore = defineStore('modals', () => {
  const modalStack = ref<IModalEntry[]>([]);

  const currentModal = computed(() => modalStack.value.at(-1)?.modal ?? null);
  const modalPayload = computed(() => modalStack.value.at(-1)?.payload ?? []);

  function openModal(modal: EModal, payload?: TModalPayload[]) {
    modalStack.value = [...modalStack.value, { modal, payload: payload ?? [] }];
  }

  function closeModal() {
    modalStack.value = modalStack.value.slice(0, -1);
  }

  return {
    currentModal,
    modalPayload,
    modalStack,
    openModal,
    closeModal
  };
});
