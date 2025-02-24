import { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Manages motion preferences across the application.
 * Handles 'prefers-reduced-motion' system preference, user overrides, and persistence.
 * User overrides are stored in localStorage, and always take precedence over system settings.
 */
export class MotionPreferenceManager {
  static #instance: MotionPreferenceManager;

  #STORAGE_KEY = "bc-reduced-motion";

  #mediaQuery: MediaQueryList;

  #listeners = new Set<(reduce: boolean) => void>();

  #userOverride: boolean | null = null;

  constructor() {
    this.#mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.#mediaQuery.addEventListener(
      "change",
      this.#handleSystemPreferenceChange.bind(this),
    );

    // Load user preference from storage
    const stored = localStorage.getItem(this.#STORAGE_KEY);

    if (stored !== null) {
      this.#userOverride = stored === "true";
      this.#updateRootClass();
    }
  }

  static getInstance(): MotionPreferenceManager {
    if (!MotionPreferenceManager.#instance) {
      MotionPreferenceManager.#instance = new MotionPreferenceManager();
    }
    return MotionPreferenceManager.#instance;
  }

  /**
   * Get current reduced motion preference
   * Prioritizes user override over system preference
   */
  get reducedMotion(): boolean {
    return this.#userOverride ?? this.#mediaQuery.matches;
  }

  /**
   * Get current reduced motion preference
   * Prioritizes user override over system preference
   *
   * shorthand for `MotionPreferenceManager.getInstance().reducedMotion`
   */
  static get reducedMotion(): boolean {
    return MotionPreferenceManager.getInstance().reducedMotion;
  }

  /**
   * Set user's motion preference
   * @param reduced - Whether motion should be reduced
   */
  setReducedMotion(reduced: boolean) {
    this.#userOverride = reduced;
    localStorage.setItem(this.#STORAGE_KEY, String(reduced));
    this.#updateRootClass();
    this.#notifyListeners();
  }

  /**
   * Reset to system preference
   */
  resetToSystemPreference() {
    this.#userOverride = null;
    localStorage.removeItem(this.#STORAGE_KEY);
    this.#notifyListeners();
  }

  /**
   * Subscribe to preference changes
   * @param callback - Function to call when preference changes
   * @param options - Options object
   * @returns Cleanup function
   */
  subscribe(
    callback: (reduce: boolean) => void,
    options: { immediate?: boolean; signal?: AbortSignal } = {},
  ) {
    const { immediate = false, signal } = options;
    this.#listeners.add(callback);
    if (immediate) callback(this.reducedMotion);

    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          this.#listeners.delete(callback);
        },
        { once: true },
      );
    }

    return () => {
      this.#listeners.delete(callback);
    };
  }

  /**
   * Subscribe to preference changes
   *
   * shorthand for `MotionPreferenceManager.getInstance().subscribe`
   *
   * @param callback - Function to call when preference changes
   * @param options - Options object
   * @returns Cleanup function
   */
  static subscribe(
    callback: (reduce: boolean) => void,
    options: { immediate?: boolean; signal?: AbortSignal } = {},
  ) {
    return MotionPreferenceManager.getInstance().subscribe(callback, options);
  }

  /**
   * @private
   */
  #handleSystemPreferenceChange = () => {
    if (this.#userOverride === null) {
      this.#notifyListeners();
    }
  };

  /**
   * @private
   */
  #notifyListeners() {
    const reduced = this.reducedMotion;
    this.#listeners.forEach((listener) => listener(reduced));
  }

  /**
   * @private
   */
  #updateRootClass() {
    if (this.#userOverride !== null) {
      const root = document.documentElement;
      if (this.#userOverride) {
        root.classList.add("force-reduced-motion");
        root.classList.remove("force-no-reduced-motion");
      } else {
        root.classList.add("force-no-reduced-motion");
        root.classList.remove("force-reduced-motion");
      }
    }
  }
}

/**
 * Reactive controller for managing motion preferences.
 * Automatically updates the host element when the preference changes.
 */
export class MotionPreferenceController implements ReactiveController {
  private host: ReactiveControllerHost;
  private unsubscribe: (() => void) | undefined;
  private onChangeCallback: ((reduce: boolean) => void) | undefined;

  public get reduce() {
    return MotionPreferenceManager.reducedMotion;
  }

  public setReducedMotion(value: boolean) {
    MotionPreferenceManager.getInstance().setReducedMotion(value);
  }

  constructor(
    host: ReactiveControllerHost,
    onChangeCallback?: (reduce: boolean) => void,
  ) {
    (this.host = host).addController(this);
    this.onChangeCallback = onChangeCallback;
  }

  hostConnected() {
    this.unsubscribe = MotionPreferenceManager.subscribe(() => {
      this.host.requestUpdate();
      this.onChangeCallback?.(this.reduce);
    });
  }

  hostDisconnected() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }
}
