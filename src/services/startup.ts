import { useActiveProfileStore, type User } from '@/stores/activeProfile';
import ApiService from './api_request';
import { useConfigurationStore } from '@/stores/configuration';

export interface InitializeObj {
  currentSeason: number;
  loggedUser: User;
  seasonStart: string;
  currentWeek: number;
}

export default class StartupService {
  private apiRequest;
  private activeProfileStore;
  private configurationStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.activeProfileStore = useActiveProfileStore();
    this.configurationStore = useConfigurationStore();
  }

  public async initialize(callback: (isSuccess: boolean) => void) {
    this.activeProfileStore.setLoading(true);
    this.configurationStore.setLoading(true);
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
      this.configurationStore.setError(null);

      return callback(true);
    } catch (error: any) {
      this.activeProfileStore.setLoading(false);
      this.configurationStore.setLoading(false);
      this.configurationStore.setError(new Error(error));
      return callback(false);
    }
  }
}
