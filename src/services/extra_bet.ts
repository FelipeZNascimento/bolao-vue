import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import type { IExtraBet, IExtraBetBet, ITeamWithExtras } from '@/stores/extraBet.types';
import { isFulfilled, isRejected } from '@/util/promiseCheck';
import ApiService from './api_request';

export default class ExtraBetService {
  private activeProfileStore;
  private apiRequest;
  private configurationStore;
  private extraBetStore;

  constructor() {
    this.apiRequest = new ApiService();
    this.extraBetStore = useExtraBetStore();
    this.configurationStore = useConfigurationStore();
    this.activeProfileStore = useActiveProfileStore();
  }

  public async fetch() {
    const activeProfile = this.activeProfileStore.activeProfile;
    this.extraBetStore.setLoading(true);

    try {
      const [extraResponse, extraResultsResponse] = await Promise.allSettled([
        this.apiRequest.get<{ extraBets: IExtraBet[]; activeProfileExtraBets: IExtraBet[] }>(`bet/extra/`),
        this.apiRequest.get<IExtraBetBet[]>(`bet/extra/results`)
      ]);

      if (isRejected(extraResponse) || isRejected(extraResultsResponse)) {
        throw new Error('Falha ao buscar apostas extras');
      }

      const extraBetsResponse = isFulfilled(extraResponse)
        ? extraResponse.value
        : { extraBets: [], activeProfileExtraBets: [] };
      const extraBetsResults = isFulfilled(extraResultsResponse) ? extraResultsResponse.value : [];

      if (activeProfile) {
        this.extraBetStore.setLoggedUserBets(
          extraBetsResponse.activeProfileExtraBets.length > 0 ? extraBetsResponse.activeProfileExtraBets[0] : null
        );
      }
      this.extraBetStore.setExtraBetsResults(extraBetsResults.length ? extraBetsResults : null);

      const splittedBetsByTeam = this.splitBetsByTeams(extraBetsResponse.extraBets);
      this.extraBetStore.setAllUsersBetsByTeam(splittedBetsByTeam);

      this.extraBetStore.setLoading(false);
    } catch (error: unknown) {
      this.extraBetStore.setLoading(false);
      this.extraBetStore.setError(new Error(String(error)));
    }
  }

  splitBetsByTeams(extraBets: IExtraBet[]) {
    const teamsWithExtras: ITeamWithExtras[] = [];

    extraBets.forEach((userBet) => {
      userBet.bets.forEach((bet) => {
        bet.teams.forEach((team) => {
          const existingTeam = teamsWithExtras.find((t) => t.team.id === team.id);
          if (existingTeam) {
            existingTeam.bets.push({
              type: bet.type,
              user: userBet.user
            });
          } else {
            teamsWithExtras.push({
              bets: [
                {
                  type: bet.type,
                  user: userBet.user
                }
              ],
              team
            });
          }
        });
      });
    });

    return teamsWithExtras;
  }

  public async update(
    updateObj: { [n: string]: null | number | number[] },
    callback?: (isSuccess: boolean, error?: Error) => void
  ) {
    this.extraBetStore.setUpdating(true);

    try {
      const response = await this.apiRequest.post<{
        extraBets: IExtraBet[];
        activeProfileExtraBets: IExtraBet[];
      }>(`bet/update/extra`, updateObj);

      this.extraBetStore.setLoggedUserBets(
        response.activeProfileExtraBets.length > 0 ? response.activeProfileExtraBets[0] : null
      );

      const splittedBetsByTeam = this.splitBetsByTeams(response.extraBets);
      this.extraBetStore.setAllUsersBetsByTeam(splittedBetsByTeam);

      this.extraBetStore.setUpdating(false);
      if (callback) {
        callback(true);
      }
    } catch (error: unknown) {
      this.extraBetStore.setUpdating(false);
      if (callback) {
        callback(false, error as Error);
      }
    }
  }
}
