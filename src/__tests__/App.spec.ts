import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.vue';
import { useActiveProfileStore } from '../stores/activeProfile';
import type { IUser } from '../stores/activeProfile.types';
import { useClockStore } from '../stores/clock';
import { useConfigurationStore } from '../stores/configuration';
import { useExtraBetStore } from '../stores/extraBet';

// ─── Service mocks ────────────────────────────────────────────────────────────
const mockInitialize = vi.fn();
const mockMatchFetch = vi.fn();
const mockRankingFetch = vi.fn();
const mockExtraBetFetch = vi.fn();

vi.mock('../services/startup', () => ({ default: vi.fn(() => ({ initialize: mockInitialize })) }));
vi.mock('../services/match', () => ({ default: vi.fn(() => ({ fetch: mockMatchFetch })) }));
vi.mock('../services/ranking', () => ({ default: vi.fn(() => ({ fetch: mockRankingFetch })) }));
vi.mock('../services/extra_bet', () => ({ default: vi.fn(() => ({ fetch: mockExtraBetFetch })) }));

// ─── Component stubs ──────────────────────────────────────────────────────────
vi.mock('../components/NavbarTop/NavbarTop.vue', () => ({ default: { template: '<div />' } }));
vi.mock('../components/Modals/ModalsContainer.vue', () => ({ default: { template: '<div />' } }));
vi.mock('../components/FooterComponent.vue', () => ({ default: { template: '<div />' } }));
vi.mock('vue-router', () => ({ RouterView: { template: '<div />' } }));

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const MOCK_USER: IUser = {
  active: true,
  admin: false,
  balance: 0,
  color: '#ffffff',
  email: 'test@bolao.com',
  fullName: 'Test User',
  icon: '🏈',
  id: 1,
  seasonId: 2025,
  isOnline: true,
  name: 'Test',
  favorites: [],
  fleaflicker: null
};

describe('App.vue', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
    // Default: startup resolves successfully with no active user
    mockInitialize.mockImplementation(async (callback: (ok: boolean) => void) => callback(true));
  });

  function mountApp() {
    const clockStore = useClockStore();
    vi.spyOn(clockStore, 'startClock').mockImplementation(() => {});
    const wrapper = mount(App, { global: { plugins: [pinia] } });
    return { wrapper, clockStore };
  }

  // ─── Startup ─────────────────────────────────────────────────────────────────

  describe('startup', () => {
    it('calls startupService.initialize on mount', () => {
      mountApp();
      expect(mockInitialize).toHaveBeenCalledOnce();
    });

    it('calls matchService.fetch when startup succeeds', async () => {
      mountApp();
      await flushPromises();
      expect(mockMatchFetch).toHaveBeenCalledOnce();
    });

    it('does NOT call matchService.fetch when startup fails', async () => {
      mockInitialize.mockImplementation(async (callback: (ok: boolean) => void) => callback(false));
      mountApp();
      await flushPromises();
      expect(mockMatchFetch).not.toHaveBeenCalled();
    });

    it('calls clockStore.startClock after init resolves', async () => {
      const { clockStore } = mountApp();
      await flushPromises();
      expect(clockStore.startClock).toHaveBeenCalledOnce();
    });

    it('calls rankingService.fetch after init resolves', async () => {
      mountApp();
      await flushPromises();
      expect(mockRankingFetch).toHaveBeenCalledOnce();
    });

    it('calls extraBetService.fetch after init when user is logged in', async () => {
      useActiveProfileStore().setActiveProfile(MOCK_USER);
      mountApp();
      await flushPromises();
      expect(mockExtraBetFetch).toHaveBeenCalledOnce();
    });

    it('does NOT call extraBetService.fetch after init when guest', async () => {
      mountApp();
      await flushPromises();
      expect(mockExtraBetFetch).not.toHaveBeenCalled();
    });
  });

  // ─── activeProfile watcher ───────────────────────────────────────────────────

  describe('activeProfile watcher', () => {
    it('skips watch fetches while initializing, then fetches via .then() on resolve', async () => {
      let resolveInit!: () => void;
      mockInitialize.mockImplementation(async (callback: (ok: boolean) => void) => {
        callback(true); // triggers matchService.fetch via initializationCallback
        await new Promise<void>((resolve) => {
          resolveInit = resolve;
        });
      });

      mountApp();

      // Simulate startup setting the profile while init is still pending
      useActiveProfileStore().setActiveProfile(MOCK_USER);
      await flushPromises();

      // Watcher fired but was blocked by isInitializing — no ranking/extra fetch yet
      expect(mockRankingFetch).not.toHaveBeenCalled();
      expect(mockExtraBetFetch).not.toHaveBeenCalled();

      // Resolve init — .then() block now runs with activeProfile already set
      resolveInit();
      await flushPromises();

      expect(mockRankingFetch).toHaveBeenCalledOnce();
      expect(mockExtraBetFetch).toHaveBeenCalledOnce();
    });

    it('calls rankingService.fetch and matchService.fetch when user logs in after init', async () => {
      mountApp();
      await flushPromises();
      vi.clearAllMocks();

      useActiveProfileStore().setActiveProfile(MOCK_USER);
      await flushPromises();

      expect(mockRankingFetch).toHaveBeenCalledOnce();
      expect(mockMatchFetch).toHaveBeenCalledOnce();
    });

    it('calls extraBetService.fetch when user logs in after init', async () => {
      mountApp();
      await flushPromises();
      vi.clearAllMocks();

      useActiveProfileStore().setActiveProfile(MOCK_USER);
      await flushPromises();

      expect(mockExtraBetFetch).toHaveBeenCalledOnce();
    });

    it('calls setLoggedUserBets(null) and skips extraBetService.fetch when user logs out', async () => {
      useActiveProfileStore().setActiveProfile(MOCK_USER);
      mountApp();
      await flushPromises();
      vi.clearAllMocks();

      const extraBetStore = useExtraBetStore();
      vi.spyOn(extraBetStore, 'setLoggedUserBets');

      useActiveProfileStore().setActiveProfile(null);
      await flushPromises();

      expect(extraBetStore.setLoggedUserBets).toHaveBeenCalledWith(null);
      expect(mockExtraBetFetch).not.toHaveBeenCalled();
    });

    it('calls rankingService.fetch and matchService.fetch when user logs out', async () => {
      useActiveProfileStore().setActiveProfile(MOCK_USER);
      mountApp();
      await flushPromises();
      vi.clearAllMocks();

      useActiveProfileStore().setActiveProfile(null);
      await flushPromises();

      expect(mockRankingFetch).toHaveBeenCalledOnce();
      expect(mockMatchFetch).toHaveBeenCalledOnce();
    });
  });

  // ─── selectedWeek watcher ────────────────────────────────────────────────────

  describe('selectedWeek watcher', () => {
    it('calls matchService.fetch when selectedWeek changes', async () => {
      mountApp();
      await flushPromises();
      vi.clearAllMocks();

      useConfigurationStore().setSelectedWeek(2);
      await flushPromises();

      expect(mockMatchFetch).toHaveBeenCalledOnce();
    });

    it('does NOT call matchService.fetch when selectedWeek is set to the same value', async () => {
      useConfigurationStore().setSelectedWeek(1);
      mountApp();
      await flushPromises();
      vi.clearAllMocks();

      useConfigurationStore().setSelectedWeek(1); // same value — Vue won't fire the watcher
      await flushPromises();

      expect(mockMatchFetch).not.toHaveBeenCalled();
    });
  });
});
