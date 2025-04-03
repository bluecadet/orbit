import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  MOTION_PREF_STORAGE_KEY,
  MotionPreferenceManager,
} from "../motion-preference";

class MockMediaQuery {
  #matches = false;
  #listeners: ((ev: MediaQueryListEvent) => void)[] = [];

  set matches(value: boolean) {
    this.#matches = value;
    this.#listeners.forEach((listener) =>
      listener({ matches: value } as MediaQueryListEvent),
    );
  }

  get matches() {
    return this.#matches;
  }

  addEventListener(_: string, listener: (ev: MediaQueryListEvent) => void) {
    this.#listeners.push(listener);
  }

  removeEventListener(_: string, listener: (ev: MediaQueryListEvent) => void) {
    this.#listeners = this.#listeners.filter((l) => l !== listener);
  }

  clearListeners() {
    this.#listeners = [];
  }
}

const mockSystemMotionPreference = new MockMediaQuery();

describe("MotionPreferenceManager", () => {
  beforeAll(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => mockSystemMotionPreference),
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    localStorage.clear();
    MotionPreferenceManager.resetInstance();
    mockSystemMotionPreference.clearListeners();
    mockSystemMotionPreference.matches = false;
  });

  it("should be a singleton", () => {
    const instance1 = MotionPreferenceManager.getInstance();
    const instance2 = MotionPreferenceManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should check system preference on initialization", () => {
    expect(MotionPreferenceManager.getInstance().reducedMotion).toBe(false);
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );

    MotionPreferenceManager.resetInstance();
    mockSystemMotionPreference.matches = true;

    expect(MotionPreferenceManager.getInstance().reducedMotion).toBe(true);
  });

  it("should signal listeners on system preference change", () => {
    const manager = MotionPreferenceManager.getInstance();
    const callback = vi.fn();
    manager.subscribe(callback);

    mockSystemMotionPreference.matches = true;
    mockSystemMotionPreference.matches = false;

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(true);
    expect(callback).toHaveBeenCalledWith(false);
  });

  it("should load user preference from localStorage on initialization", () => {
    localStorage.setItem(MOTION_PREF_STORAGE_KEY, "true");
    expect(MotionPreferenceManager.getInstance().reducedMotion).toBe(true);

    MotionPreferenceManager.resetInstance();

    localStorage.clear();
    expect(MotionPreferenceManager.getInstance().reducedMotion).toBe(false);

    localStorage.setItem(MOTION_PREF_STORAGE_KEY, "false");
    expect(MotionPreferenceManager.getInstance().reducedMotion).toBe(false);
  });

  it("should notify subscribers when preference changes", () => {
    const manager = MotionPreferenceManager.getInstance();
    const callback = vi.fn();

    const unsubscribe = manager.subscribe(callback);
    expect(callback).not.toHaveBeenCalled();

    manager.setReducedMotion(true);
    expect(callback).toHaveBeenCalledWith(true);

    manager.setReducedMotion(false);
    expect(callback).toHaveBeenCalledWith(false);

    // Test unsubscribe
    unsubscribe();
    manager.setReducedMotion(true);
    expect(callback).toHaveBeenCalledTimes(2); // No additional calls
  });

  it("user preference should override system preference", () => {
    // Set system preference to true
    mockSystemMotionPreference.matches = false;
    const manager = MotionPreferenceManager.getInstance();
    expect(manager.reducedMotion).toBe(false);

    manager.setReducedMotion(false);

    mockSystemMotionPreference.matches = true;
    expect(manager.reducedMotion).toBe(false);

    manager.setReducedMotion(true);
    expect(manager.reducedMotion).toBe(true);

    mockSystemMotionPreference.matches = false;
    expect(manager.reducedMotion).toBe(true);
  });

  it("should fall back to system preference when user preference is reset", () => {
    // Set system preference to true
    mockSystemMotionPreference.matches = true;
    const manager = MotionPreferenceManager.getInstance();
    expect(manager.reducedMotion).toBe(true);

    // Set user preference
    manager.setReducedMotion(false);
    expect(manager.reducedMotion).toBe(false);

    // Reset to system preference (which is now true)
    manager.resetToSystemPreference();
    expect(localStorage.getItem(MOTION_PREF_STORAGE_KEY)).toBeNull();
    expect(manager.reducedMotion).toBe(true);

    // changing system preference should now update the value
    mockSystemMotionPreference.matches = false;
    expect(manager.reducedMotion).toBe(false);
  });

  it("should notify subscribers immediately when immediate option is true", () => {
    const manager = MotionPreferenceManager.getInstance();
    const callback = vi.fn();

    manager.subscribe(callback, { immediate: true });
    expect(callback).toHaveBeenCalledWith(manager.reducedMotion);
  });

  it("should handle AbortSignal for subscription cleanup", () => {
    const manager = MotionPreferenceManager.getInstance();
    const callback = vi.fn();
    const controller = new AbortController();

    manager.subscribe(callback, { signal: controller.signal });
    manager.setReducedMotion(true);
    expect(callback).toHaveBeenCalledWith(true);

    controller.abort();
    manager.setReducedMotion(false);
    expect(callback).toHaveBeenCalledTimes(1); // No additional calls
  });

  it("should provide static access to reducedMotion", () => {
    // Set system preference to true
    mockSystemMotionPreference.matches = true;

    expect(MotionPreferenceManager.reducedMotion).toBe(true);

    // Set user preference
    MotionPreferenceManager.getInstance().setReducedMotion(false);
    expect(MotionPreferenceManager.reducedMotion).toBe(false);
  });

  it("should provide static subscribe method", () => {
    const callback = vi.fn();
    const unsubscribe = MotionPreferenceManager.subscribe(callback);

    MotionPreferenceManager.getInstance().setReducedMotion(true);
    expect(callback).toHaveBeenCalledWith(true);

    unsubscribe();
  });

  it("should not notify subscribers when system preference changes with user override", () => {
    const manager = MotionPreferenceManager.getInstance();
    const callback = vi.fn();
    manager.subscribe(callback);

    // Set user preference
    manager.setReducedMotion(false);
    callback.mockClear();

    mockSystemMotionPreference.matches = true;
    mockSystemMotionPreference.matches = false;
    mockSystemMotionPreference.matches = true;
    mockSystemMotionPreference.matches = false;

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not notify subscribers if new value is same as old", () => {
    const manager = MotionPreferenceManager.getInstance();
    const callback = vi.fn();

    manager.subscribe(callback);

    mockSystemMotionPreference.matches = false;
    mockSystemMotionPreference.matches = false;
    mockSystemMotionPreference.matches = false;

    expect(callback).not.toHaveBeenCalled();

    mockSystemMotionPreference.matches = true;
    mockSystemMotionPreference.matches = true;
    mockSystemMotionPreference.matches = true;

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true);

    manager.setReducedMotion(false);

    callback.mockClear();

    manager.setReducedMotion(false);
    manager.setReducedMotion(false);
    manager.setReducedMotion(false);

    expect(callback).not.toHaveBeenCalled();

    manager.setReducedMotion(true);
    manager.setReducedMotion(true);
    manager.setReducedMotion(true);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true);
  });
});
