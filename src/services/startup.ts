import { useActiveProfileStore, type User } from '@/stores/activeProfile';
import {
  type RankingPosition,
  type ResultsView,
  useConfigurationStore,
} from '@/stores/configuration';
import { type ConferenceTeams, useExtraBetStore } from '@/stores/extraBet';

import ApiService from './api_request';

export interface InitializeObj {
  currentSeason: number;
  currentWeek: number;
  loggedUser: User;
  seasonStart: string;
  teamsByConferenceAndDivision: {
    afc: ConferenceTeams;
    nfc: ConferenceTeams;
  };
}

export default class StartupService {
  private activeProfileStore;
  private apiRequest;
  private configurationStore;
  private extraBetStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.activeProfileStore = useActiveProfileStore();
    this.configurationStore = useConfigurationStore();
    this.extraBetStore = useExtraBetStore();
  }

  public async initialize(callback: (isSuccess: boolean) => void) {
    this.initializeLocalStoragePreferences();
    this.activeProfileStore.setLoading(true);
    this.configurationStore.setLoading(true);
    this.extraBetStore.setLoading(true);
    try {
      const response = await this.apiRequest.get<InitializeObj>('initialize/');
      // Set Active Profile store properties
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(response.loggedUser);

      // Set Configuration store properties
      this.configurationStore.setLoading(false);
      this.configurationStore.setCurrentSeason(response.currentSeason);
      this.configurationStore.setCurrentWeek(response.currentWeek);
      this.configurationStore.setSelectedWeek(response.currentWeek);
      this.configurationStore.setSeasonStart(parseInt(response.seasonStart));
      this.configurationStore.setError(null);

      // Set Extras store properties
      this.extraBetStore.setLoading(false);
      this.extraBetStore.setAfcTeams(response.teamsByConferenceAndDivision.afc);
      this.extraBetStore.setNfcTeams(response.teamsByConferenceAndDivision.nfc);

      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.configurationStore.setLoading(false);
      this.extraBetStore.setLoading(false);
      this.configurationStore.setError(new Error(error));
      return callback(false);
    }
  }

  initializeLocalStoragePreferences() {
    const themePreference = localStorage.getItem('theme-preference');
    const resultsViewPreference = localStorage.getItem('results-view') as ResultsView;
    const rankingPositionPreference = localStorage.getItem('ranking-position') as RankingPosition;

    if (rankingPositionPreference) {
      this.configurationStore.setRankingPosition(rankingPositionPreference);
    } else {
      localStorage.setItem('ranking-position', 'active');
    }

    if (resultsViewPreference) {
      this.configurationStore.setResultsView(resultsViewPreference);
    } else {
      localStorage.setItem('results-view', 'grid');
    }

    if (themePreference) {
      document.documentElement.setAttribute('data-theme', themePreference);
      if (themePreference === 'light') {
        this.configurationStore.setTheme('light');
        document.documentElement.classList.remove('dark-mode');
      } else {
        this.configurationStore.setTheme('dark');
        document.documentElement.classList.add('dark-mode');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.configurationStore.setTheme('dark');
    } else {
      this.configurationStore.setTheme('light');
    }
  }
}
