import { useActiveProfileStore } from '@/stores/activeProfile';
import type { IUser } from '@/stores/activeProfile.types';
import { useConfigurationStore } from '@/stores/configuration';
import type { TRankingPositionValue, TResultsViewValue } from '@/stores/configuration.types';
import { useExtraBetStore } from '@/stores/extraBet';
import type { IConferenceTeams } from '@/stores/extraBet.types';
import type { ITeam } from '@/stores/matches.types';
import { useTeamsStore } from '@/stores/teams';
import { isFulfilled, isRejected } from '@/util/promiseCheck';
import ApiService from './api_request';

export interface InitializeObj {
  currentSeason: number;
  currentWeek: null | number;
  seasonStart: string;
}

export interface TeamByConferenceAndDivision {
  AFC: IConferenceTeams;
  NFC: IConferenceTeams;
}

export default class StartupService {
  private activeProfileStore;
  private apiRequest;
  private configurationStore;
  private extraBetStore;
  private teamsStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.activeProfileStore = useActiveProfileStore();
    this.configurationStore = useConfigurationStore();
    this.extraBetStore = useExtraBetStore();
    this.teamsStore = useTeamsStore();
  }

  public async initialize(callback: (isSuccess: boolean) => void) {
    this.initializeLocalStoragePreferences();
    this.activeProfileStore.setLoading(true);
    this.configurationStore.setLoading(true);
    this.extraBetStore.setLoading(true);
    this.teamsStore.setLoading(true);
    try {
      const [activeProfileResponse, seasonResponse, teamByConferenceAndDivisionResponse, teamResponse] =
        await Promise.allSettled([
          this.apiRequest.get<IUser>('user/activeProfile'),
          this.apiRequest.get<InitializeObj>('season/current'),
          this.apiRequest.get<TeamByConferenceAndDivision>('team/conferenceAndDivision'),
          this.apiRequest.get<ITeam[]>('team/')
        ]);

      if (
        isRejected(activeProfileResponse) ||
        isRejected(seasonResponse) ||
        isRejected(teamByConferenceAndDivisionResponse) ||
        isRejected(teamResponse)
      ) {
        throw new Error('Falha ao inicializar a aplicação');
      }

      const loggedUser = isFulfilled(activeProfileResponse) ? activeProfileResponse.value : null;
      const seasonData = isFulfilled(seasonResponse) ? seasonResponse.value : null;
      const teamByConferenceAndDivision = isFulfilled(teamByConferenceAndDivisionResponse)
        ? teamByConferenceAndDivisionResponse.value
        : null;
      const teams = isFulfilled(teamResponse) ? teamResponse.value : null;

      // Set Active Profile store properties
      this.activeProfileStore.setLoading(false);
      this.activeProfileStore.setActiveProfile(loggedUser);

      // Set Configuration store properties
      this.configurationStore.setLoading(false);
      const currentWeek = seasonData?.currentWeek ?? 1;
      if (seasonData) {
        this.configurationStore.setCurrentSeason(seasonData.currentSeason);
        this.configurationStore.setCurrentWeek(currentWeek);
        this.configurationStore.setSelectedWeek(currentWeek);
        this.configurationStore.setSeasonStart(parseInt(seasonData.seasonStart));
        this.configurationStore.setError(null);
      }

      // Set Extras store properties
      if (teams) {
        this.teamsStore.setTeams(teams);
      }
      if (teamByConferenceAndDivision) {
        this.teamsStore.setAfcTeams(teamByConferenceAndDivision.AFC);
        this.teamsStore.setNfcTeams(teamByConferenceAndDivision.NFC);
      }
      this.extraBetStore.setLoading(false);
      this.teamsStore.setLoading(false);

      return callback(true);
    } catch (error: unknown) {
      this.activeProfileStore.setLoading(false);
      this.configurationStore.setLoading(false);
      this.extraBetStore.setLoading(false);
      this.configurationStore.setError(new Error(String(error)));
      return callback(false);
    }
  }

  initializeLocalStoragePreferences() {
    const themePreference = localStorage.getItem('theme-preference');
    const resultsViewPreference = localStorage.getItem('results-view') as TResultsViewValue;
    const rankingPositionPreference = localStorage.getItem('ranking-position') as TRankingPositionValue;

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
