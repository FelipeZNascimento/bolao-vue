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

    // Clear any stale errors from a previous attempt
    this.activeProfileStore.setError(null);
    this.configurationStore.setError(null);
    this.teamsStore.setError(null);

    const [activeProfileResponse, seasonResponse, teamByConferenceAndDivisionResponse, teamResponse] =
      await Promise.allSettled([
        this.apiRequest.get<IUser>('user/activeProfile'),
        this.apiRequest.get<InitializeObj>('season/current'),
        this.apiRequest.get<TeamByConferenceAndDivision>('team/conferenceAndDivision'),
        this.apiRequest.get<ITeam[]>('team/')
      ]);

    // Active profile: a 401 (guest) is not an error — treat rejection as "no user"
    this.activeProfileStore.setLoading(false);
    this.activeProfileStore.setActiveProfile(isFulfilled(activeProfileResponse) ? activeProfileResponse.value : null);

    // Season config: required for the app to function
    this.configurationStore.setLoading(false);
    if (isFulfilled(seasonResponse)) {
      const seasonData = seasonResponse.value;
      const currentWeek = seasonData.currentWeek ?? 1;
      this.configurationStore.setCurrentSeason(seasonData.currentSeason);
      this.configurationStore.setCurrentWeek(currentWeek);
      this.configurationStore.setSelectedWeek(currentWeek);
      this.configurationStore.setSeasonStart(parseInt(seasonData.seasonStart));
    } else {
      const reason = seasonResponse.reason;
      this.configurationStore.setError(reason instanceof Error ? reason : new Error(String(reason)));
    }

    // Teams: required for bets/extras to work
    this.teamsStore.setLoading(false);
    this.extraBetStore.setLoading(false);
    if (isFulfilled(teamResponse)) {
      this.teamsStore.setTeams(teamResponse.value);
    } else {
      const reason = teamResponse.reason;
      this.teamsStore.setError(reason instanceof Error ? reason : new Error(String(reason)));
    }
    if (isFulfilled(teamByConferenceAndDivisionResponse)) {
      this.teamsStore.setAfcTeams(teamByConferenceAndDivisionResponse.value.AFC);
      this.teamsStore.setNfcTeams(teamByConferenceAndDivisionResponse.value.NFC);
    } else {
      const reason = teamByConferenceAndDivisionResponse.reason;
      this.teamsStore.setError(reason instanceof Error ? reason : new Error(String(reason)));
    }

    // Fail the startup only if the critical season data could not be loaded
    const criticalFailure = isRejected(seasonResponse);
    return callback(!criticalFailure);
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
