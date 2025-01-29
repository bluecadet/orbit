import { LitElement } from "lit";

/**
 * Manages motion preferences across the application.
 * Handles system preferences, user overrides, and persistence.
 */
class MotionPreferenceManager {
  private static instance: MotionPreferenceManager;
  private readonly STORAGE_KEY = "orbit-reduced-motion";
  private mediaQuery: MediaQueryList;
  private listeners = new Set<(reduced: boolean) => void>();
  private userOverride: boolean | null = null;

  private constructor() {
    this.mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.mediaQuery.addEventListener(
      "change",
      this.handleSystemPreferenceChange,
    );

    // Load user preference from storage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored !== null) {
      this.userOverride = stored === "true";
    }
  }

  static getInstance(): MotionPreferenceManager {
    if (!MotionPreferenceManager.instance) {
      MotionPreferenceManager.instance = new MotionPreferenceManager();
    }
    return MotionPreferenceManager.instance;
  }

  /**
   * Get current reduced motion preference
   * Prioritizes user override over system preference
   */
  get reducedMotion(): boolean {
    return this.userOverride ?? this.mediaQuery.matches;
  }

  /**
   * Set user's motion preference
   * @param reduced Whether motion should be reduced
   */
  setReducedMotion(reduced: boolean): void {
    this.userOverride = reduced;
    localStorage.setItem(this.STORAGE_KEY, String(reduced));
    this.notifyListeners();
  }

  /**
   * Reset to system preference
   */
  resetToSystemPreference(): void {
    this.userOverride = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.notifyListeners();
  }

  /**
   * Subscribe to preference changes
   * @param callback Function to call when preference changes
   * @returns Cleanup function
   */
  subscribe(callback: (reduced: boolean) => void): () => void {
    this.listeners.add(callback);
    // Immediately notify of current state
    callback(this.reducedMotion);

    return () => {
      this.listeners.delete(callback);
    };
  }

  private handleSystemPreferenceChange = () => {
    if (this.userOverride === null) {
      this.notifyListeners();
    }
  };

  private notifyListeners(): void {
    const reduced = this.reducedMotion;
    this.listeners.forEach((listener) => listener(reduced));
  }
}

/**
 * Base class for components that need motion preference awareness
 */
export class MotionAwareElement extends LitElement {
  protected motionManager = MotionPreferenceManager.getInstance();
  private unsubscribe?: () => void;

  protected get reducedMotion(): boolean {
    return this.motionManager.reducedMotion;
  }

  protected onMotionPreferenceChange(): void {
    this.requestUpdate();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribe = this.motionManager.subscribe(() =>
      this.onMotionPreferenceChange(),
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }
}

export const motionPreference = MotionPreferenceManager.getInstance();
