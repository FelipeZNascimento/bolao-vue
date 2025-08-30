import type { Conference, Division, ExtrasTeam } from '@/stores/extraBet';

export type ConferenceChampions = {
  [key in Conference]: ExtrasTeam | null;
};

export type DivisionChampions = {
  [key in Conference]: {
    [key in Division]: ExtrasTeam | null;
  };
};

export type ExtrasAfterToggle = 'Geral' | 'Minhas';
export type ExtrasBeforeToggle = 'Playoffs' | Conference;

export type Wildcards = {
  [key in Conference]: ExtrasTeam[];
};
