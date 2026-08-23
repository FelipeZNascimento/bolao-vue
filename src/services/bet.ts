import type { IMatch } from '@/stores/matches.types';
import ApiService from './api_request';

export default class BetService {
  private apiRequest;

  constructor() {
    this.apiRequest = new ApiService();
  }

  public async updateBet(matchId: number, betValue: number, callback?: (isSuccess: boolean, error?: Error) => void) {
    const betObject = { betValue, matchId };

    try {
      await this.apiRequest.post<IMatch>('bet/update/', betObject);
      if (callback) {
        callback(true);
      }
    } catch (error: unknown) {
      if (callback) {
        callback(false, error as Error);
      }
    }
  }
}
