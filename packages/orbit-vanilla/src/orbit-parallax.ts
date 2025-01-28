import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cancelFrame, frame } from "motion";

// Shared state manager for all parallax instances
class ParallaxManager {
  private static instance: ParallaxManager;
  private elements: Set<OrbitParallax> = new Set();
  private frameSubscription: ReturnType<typeof frame['update']> | null = null;
  private viewportHeight: number = window.innerHeight;

  private constructor() {
    // Set up resize observer for viewport height changes
    window.addEventListener('resize', () => {
      this.viewportHeight = window.innerHeight;
    }, { passive: true });
  }

  static getInstance(): ParallaxManager {
    if (!ParallaxManager.instance) {
      ParallaxManager.instance = new ParallaxManager();
    }
    return ParallaxManager.instance;
  }

  addElement(element: OrbitParallax) {
    if (this.elements.size === 0) {
      this.startUpdates();
    }
    this.elements.add(element);
  }

  removeElement(element: OrbitParallax) {
    this.elements.delete(element);
    if (this.elements.size === 0) {
      this.stopUpdates();
    }
  }

  private startUpdates() {
    console.log('start updates');

    this.frameSubscription = frame.update(() => {
      this.updateElements();
    }, true);
  }

  private stopUpdates() {
    if (this.frameSubscription) {
      cancelFrame(this.frameSubscription);
      this.frameSubscription = null;
    }
  }

  private updateElements() {
    console.log('updating');
    const viewportCenter = this.viewportHeight / 2;
    
    for (const element of this.elements) {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + (rect.height / 2);
      
      // Calculate distance from viewport center (-1 to 1)
      // 0 = element is centered (no transform)
      // 1 = element is at top
      // -1 = element is at bottom
      const distanceFromCenter = (viewportCenter - elementCenter) / (this.viewportHeight / 2);
      
      // Apply parallax transform
      const offset = distanceFromCenter * (1- element.speed) * (rect.height / 2);
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