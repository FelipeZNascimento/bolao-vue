import type { IUser } from '@/stores/activeProfile.types';
import { useAdminStore } from '@/stores/admin';
import type { IAdminCacheDetail, IAdminCacheResponse } from '@/stores/admin.types';
import ApiService from './api_request';

export default class AdminService {
  private api: ApiService;
  private store: ReturnType<typeof useAdminStore>;

  constructor() {
    this.api = new ApiService();
    this.store = useAdminStore();
  }

  // ── Users ──────────────────────────────────────────────────────────────────

  async fetchUsers(): Promise<void> {
    this.store.setUsersLoading(true);
    this.store.setUsersError(null);
    try {
      const users = await this.api.get<IUser[]>('admin/users/');
      this.store.setUsers(users);
    } catch (e) {
      this.store.setUsersError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      this.store.setUsersLoading(false);
    }
  }

  /** Throws on failure so the calling component can show a dialog-level error. */
  async updateBalance(userId: number, balance: number): Promise<IUser> {
    const updated = await this.api.post<IUser>(`admin/users/update-balance/${userId}`, { balance });
    this.store.updateUser(updated);
    return updated;
  }

  /** Throws on failure so the calling component can show a row-level error. */
  async toggleActiveStatus(userId: number): Promise<void> {
    const updated = await this.api.get<IUser[]>(`admin/users/toggle-active-status/${userId}`);
    this.store.setUsers(updated);
  }

  // ── Cache ──────────────────────────────────────────────────────────────────

  async fetchCache(): Promise<void> {
    this.store.setCacheLoading(true);
    this.store.setCacheError(null);
    try {
      const { entries, stats } = await this.api.get<IAdminCacheResponse>('admin/cache/');
      this.store.setCacheKeys(entries);
      this.store.setCacheStats(stats);
    } catch (e) {
      this.store.setCacheError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      this.store.setCacheLoading(false);
    }
  }

  /** Returns the raw cached value; caller manages loading/error state. */
  async fetchCacheDetail(key: string): Promise<IAdminCacheDetail> {
    return this.api.get<IAdminCacheDetail>(`admin/cache/${key}`);
  }
}
