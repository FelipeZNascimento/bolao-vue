import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useClockStore } from '../stores/clock';
import { useConfigurationStore } from '../stores/configuration';

beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── isSeasonStarted ──────────────────────────────────────────────────────────

describe('isSeasonStarted', () => {
  it('is false when seasonStart is null (not yet configured)', () => {
    const clock = useClockStore();
    // configurationStore.seasonStart defaults to null
    expect(clock.isSeasonStarted).toBe(false);
  });

  it('is false when current time is before seasonStart', () => {
    const config = useConfigurationStore();
    const clock = useClockStore();

    // Set seasonStart 1 hour in the future
    const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
    config.setSeasonStart(futureTimestamp);

    expect(clock.isSeasonStarted).toBe(false);
  });

  it('is true when current time equals seasonStart', () => {
    const config = useConfigurationStore();

    // Freeze time at a specific epoch
    const frozenNow = 1_700_000_000_000; // ms
    vi.setSystemTime(frozenNow);

    const clock = useClockStore();
    // Manually sync currentTimestamp to the frozen "now"
    clock.startClock();

    const frozenTimestamp = Math.floor(frozenNow / 1000);
    config.setSeasonStart(frozenTimestamp);

    expect(clock.isSeasonStarted).toBe(true);

    clock.stopClock();
  });

  it('is true when current time is after seasonStart', () => {
    const config = useConfigurationStore();
    const frozenNow = 1_700_000_000_000; // ms
    vi.setSystemTime(frozenNow);

    const clock = useClockStore();
    clock.startClock();

    const pastTimestamp = Math.floor(frozenNow / 1000) - 3600; // 1 hour ago
    config.setSeasonStart(pastTimestamp);

    expect(clock.isSeasonStarted).toBe(true);

    clock.stopClock();
  });
});

// ─── startClock / stopClock ───────────────────────────────────────────────────

describe('startClock', () => {
  it('updates currentTimestamp immediately on start', () => {
    const frozenNow = 1_700_000_000_000;
    vi.setSystemTime(frozenNow);

    const clock = useClockStore();
    const expectedTimestamp = Math.floor(frozenNow / 1000);

    clock.startClock();

    expect(clock.currentTimestamp).toBe(expectedTimestamp);

    clock.stopClock();
  });

  it('updates currentTimestamp every second while running', () => {
    const frozenNow = 1_700_000_000_000;
    vi.setSystemTime(frozenNow);

    const clock = useClockStore();
    clock.startClock();

    const before = clock.currentTimestamp;

    // Advance fake time by 3 seconds
    vi.advanceTimersByTime(3000);

    expect(clock.currentTimestamp).toBe(before + 3);

    clock.stopClock();
  });
});

describe('stopClock', () => {
  it('freezes currentTimestamp after stopClock is called', () => {
    const frozenNow = 1_700_000_000_000;
    vi.setSystemTime(frozenNow);

    const clock = useClockStore();
    clock.startClock();

    // Tick 2 seconds, then stop
    vi.advanceTimersByTime(2000);
    const stoppedAt = clock.currentTimestamp;
    clock.stopClock();

    // Advance another 5 seconds — timestamp should not change
    vi.advanceTimersByTime(5000);

    expect(clock.currentTimestamp).toBe(stoppedAt);
  });

  it('is safe to call stopClock when clock was never started', () => {
    const clock = useClockStore();
    expect(() => clock.stopClock()).not.toThrow();
  });
});
