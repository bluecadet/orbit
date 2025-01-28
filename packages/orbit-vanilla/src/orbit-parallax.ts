import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { scroll } from "motion";

// Shared state manager for all parallax instances
class ParallaxManager {
  private static instance: ParallaxManager;
  private elements: Set<OrbitParallax> = new Set();
  private scrollSubscription: ReturnType<typeof scroll> | null = null;
  private viewportHeight: number = window.innerHeight;

  private constructor() {
    // Set up resize observer for viewport height changes
    window.addEventListener('resize', () => {
      this.viewportHeight = window.innerHeight;
      // Recalculate visibility ranges for all elements
      this.elements.forEach(element => {
        this.calculateVisibilityRange(element);
      });
    }, { passive: true });
  }

  static getInstance(): ParallaxManager {
    if (!ParallaxManager.instance) {
      ParallaxManager.instance = new ParallaxManager();
    }
    return ParallaxManager.instance;
  }

  addElement(element: OrbitParallax) {
    const wasEmpty = this.elements.size === 0;
    this.elements.add(element);
    this.calculateVisibilityRange(element);
    
    // Start scroll subscription if this is the first element
    if (wasEmpty) {
      this.startUpdates();
    }
  }

  removeElement(element: OrbitParallax) {
    this.elements.delete(element);
    if (this.elements.size === 0) {
      this.stopUpdates();
    }
  }

  /**
   * Calculate the range in which an element needs to be updated
   * This is based on the element's height, speed, and the viewport height
   */
  private calculateVisibilityRange(element: OrbitParallax) {
    const rect = element.getBoundingClientRect();
    const elementGlobalTop = rect.top + window.scrollY;
    const maxTravelDistance = (rect.height / 2) * Math.abs(1 - element.speed);

    // The element needs to be updated when it's within one viewport height plus its max travel distance
    element.updateRange = {
      start: elementGlobalTop - this.viewportHeight - maxTravelDistance,
      end: elementGlobalTop + rect.height + maxTravelDistance,
      maxTravel: maxTravelDistance
    };
  }

  private startUpdates() {
    if (!this.scrollSubscription) {
      this.scrollSubscription = scroll((_, {y}) => {
        this.updateElements(y.current)
      })
    }
  }

  private stopUpdates() {
    if (this.scrollSubscription) {
      this.scrollSubscription();
      this.scrollSubscription = null;
    }
  }

  private updateElements(scrollY: number) {
    const viewportCenter = this.viewportHeight / 2;
    
    for (const element of this.elements) {
      // Skip if element is outside its update range
      if (!element.updateRange || 
          scrollY < element.updateRange.start || 
          scrollY > element.updateRange.end) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + (rect.height / 2);
      
      // Calculate distance from viewport center (-1 to 1)
      // 0 = element is centered (no transform)
      // 1 = element is at top
      // -1 = element is at bottom
      const distanceFromCenter = (viewportCenter - elementCenter) / (this.viewportHeight / 2);
      
      // Clamp the distance based on max travel
      const clampedDistance = Math.max(-1, Math.min(1, distanceFromCenter));
      
      // Apply parallax transform
      const offset = clampedDistance * (1 - element.speed) * (rect.height / 2);
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  }
}

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
   * The speed of the parallax effect. Positive values move up, negative values move down.
   * 1.0 means the element moves at the same speed as scrolling.
   */
  @property({ type: Number }) speed = 0.5;

  /**
   * The range in which this element needs to be updated
   * @internal
   */
  updateRange?: {
    start: number;
    end: number;
    maxTravel: number;
  };

  private manager: ParallaxManager = ParallaxManager.getInstance();

  connectedCallback() {
    super.connectedCallback();
    this.manager.addElement(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.manager.removeElement(this);
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