import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { scroll } from "motion";

/**
 * Represents the range in which a parallax element should be updated.
 * This is calculated based on the element's position, size, and speed.
 */
interface VisibilityRange {
  /** The scroll position at which the element should start being updated */
  start: number;
  /** The scroll position at which the element should stop being updated */
  end: number;
  /** The maximum distance the element can travel based on its speed and size */
  maxTravel: number;
}

/**
 * Internal API for managing parallax elements.
 * This interface defines the contract between ParallaxManager and OrbitParallax elements.
 * Using an interface with WeakMap allows us to:
 * 1. Keep the implementation details private
 * 2. Maintain type safety for internal methods
 * 3. Prevent memory leaks through WeakMap's reference handling
 * 4. Hide these methods from the public API
 */
interface InternalParallaxAPI {
  /** Updates the element's visibility range based on viewport height */
  updateVisibilityRange(viewportHeight: number): void;
  /** Updates the element's transform based on its position relative to viewport center */
  updateTransform(viewportCenter: number, viewportHeight: number): void;
  /** The current visibility range of the element */
  visibilityRange?: VisibilityRange;
}

/**
 * Singleton manager for all parallax instances.
 * This class coordinates updates and shared resources across all parallax elements.
 * 
 * Key responsibilities:
 * 1. Managing scroll updates efficiently using Motion's scroll utility
 * 2. Coordinating viewport size changes
 * 3. Tracking active parallax elements
 * 4. Maintaining private APIs for each element
 * 
 * Design decisions:
 * - Uses singleton pattern to ensure single source of truth for scroll handling
 * - Leverages WeakMap for memory-safe private API storage
 * - Uses ResizeObserver for efficient viewport monitoring
 * - Only updates elements when they're within their calculated visibility range
 */
class ParallaxManager {
  private static instance: ParallaxManager;
  /** Set of all active parallax elements */
  private elements: Set<OrbitParallax> = new Set();
  /** Active scroll subscription from Motion */
  private scrollSubscription: ReturnType<typeof scroll> | null = null;
  /** Current viewport height, cached to avoid repeated DOM access */
  private viewportHeight: number = window.innerHeight;
  /** ResizeObserver for efficient viewport size monitoring */
  private resizeObserver: ResizeObserver;
  /** WeakMap storing private APIs for each element */
  private readonly internalAPI = new WeakMap<OrbitParallax, InternalParallaxAPI>();

  private constructor() {
    // Use ResizeObserver instead of resize event for better performance
    this.resizeObserver = new ResizeObserver(_ => {
      this.viewportHeight = window.innerHeight;
      this.elements.forEach(element => {
        this.internalAPI.get(element)?.updateVisibilityRange(this.viewportHeight);
      });
    });
    
    this.resizeObserver.observe(document.documentElement);
  }

  /** Get or create the singleton instance */
  static getInstance(): ParallaxManager {
    if (!ParallaxManager.instance) {
      ParallaxManager.instance = new ParallaxManager();
    }
    return ParallaxManager.instance;
  }

  /**
   * Register a new parallax element with its private API implementation
   * @param element The parallax element to register
   * @param api The element's private API implementation
   */
  addElement(element: OrbitParallax, api: InternalParallaxAPI) {
    const wasEmpty = this.elements.size === 0;
    this.elements.add(element);
    this.internalAPI.set(element, api);
    api.updateVisibilityRange(this.viewportHeight);
    
    // Only start scroll subscription if this is the first element
    if (wasEmpty) {
      this.startUpdates();
    }
  }

  /**
   * Unregister a parallax element and clean up its resources
   * @param element The element to remove
   */
  removeElement(element: OrbitParallax) {
    this.elements.delete(element);
    this.internalAPI.delete(element);
    if (this.elements.size === 0) {
      this.stopUpdates();
    }
  }

  /**
   * Start scroll position monitoring using Motion's scroll utility
   * This is only active when there are elements to update
   */
  private startUpdates() {
    if (!this.scrollSubscription) {
      this.scrollSubscription = scroll((_, {y}) => {
        this.updateElements(y.current);
      });
    }
  }

  /**
   * Stop scroll monitoring when no elements are active
   */
  private stopUpdates() {
    if (this.scrollSubscription) {
      this.scrollSubscription();
      this.scrollSubscription = null;
    }
  }

  /**
   * Update all active elements based on current scroll position
   * Only updates elements that are within their visibility range
   */
  private updateElements(scrollY: number) {
    const viewportCenter = this.viewportHeight / 2;
    
    for (const element of this.elements) {
      const api = this.internalAPI.get(element);
      if (!api) continue;

      const range = api.visibilityRange;
      if (!range || scrollY < range.start || scrollY > range.end) {
        continue;
      }

      api.updateTransform(viewportCenter, this.viewportHeight);
    }
  }

  /**
   * Clean up all resources and subscriptions
   */
  destroy() {
    this.stopUpdates();
    this.resizeObserver.disconnect();
    this.elements.clear();
  }
}

/**
 * A custom element that creates a parallax scrolling effect on its contents.
 * 
 * Features:
 * - Efficient scroll handling using Motion
 * - Visibility-based updates for performance
 * - Shared resource management
 * - Memory-safe implementation
 * 
 * @example
 * ```html
 * <orbit-parallax speed="0.5">
 *   <img src="background.jpg" alt="Parallax background">
 * </orbit-parallax>
 * ```
 */
@customElement('orbit-parallax')
export class OrbitParallax extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      will-change: transform;
    }
    ::slotted(*) {
      will-change: transform;
      display: block;
    }
  `;

  /**
   * Controls the speed and direction of the parallax effect.
   * - Values between 0 and 1 create a slower-than-scroll effect
   * - Values greater than 1 create a faster-than-scroll effect
   * - Negative values reverse the direction
   * @default 0.5
   */
  @property({ type: Number }) speed = 0.5;

  /** Private storage for element's visibility range */
  #visibilityRange?: VisibilityRange;

  /**
   * Calculate and store the range in which this element needs to be updated
   * This is based on the element's position, size, speed, and viewport height
   */
  #updateVisibilityRange(viewportHeight: number): void {
    const rect = this.getBoundingClientRect();
    const elementGlobalTop = rect.top + window.scrollY;
    const maxTravelDistance = (rect.height / 2) * Math.abs(1 - this.speed);

    this.#visibilityRange = {
      start: elementGlobalTop - viewportHeight - maxTravelDistance,
      end: elementGlobalTop + rect.height + maxTravelDistance,
      maxTravel: maxTravelDistance
    };
  }

  /**
   * Update the element's transform based on its position relative to viewport center
   * The transform is calculated to create a smooth parallax effect:
   * - No transform when element is centered in viewport
   * - Maximum transform at the edges of the visibility range
   */
  #updateTransform(viewportCenter: number, viewportHeight: number): void {
    const rect = this.getBoundingClientRect();
    const elementCenter = rect.top + (rect.height / 2);
    
    const distanceFromCenter = (viewportCenter - elementCenter) / (viewportHeight / 2);
    const clampedDistance = Math.max(-1, Math.min(1, distanceFromCenter));
    const offset = clampedDistance * (1 - this.speed) * (rect.height / 2);
    this.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  /**
   * Register with ParallaxManager and provide private API implementation
   */
  connectedCallback() {
    super.connectedCallback();
    ParallaxManager.getInstance().addElement(this, {
      updateVisibilityRange: this.#updateVisibilityRange.bind(this),
      updateTransform: this.#updateTransform.bind(this),
      get visibilityRange() { return this.#visibilityRange; }
    });
  }

  /**
   * Clean up resources when element is removed
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    ParallaxManager.getInstance().removeElement(this);
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'orbit-parallax': OrbitParallax;
  }
}