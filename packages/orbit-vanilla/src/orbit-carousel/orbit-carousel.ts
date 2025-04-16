import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import A11y from "@bluecadet/embla-carousel-a11y";
import { createContext, provide } from "@lit/context";
import EmblaCarousel from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface CarouselOptions {
  /**
   * Enable or disable infinite looping of the carousel
   * @default false
   */
  loop?: boolean;
  /**
   * Align the slides within the carousel
   * @default start
   */
  alignSlides?: "start" | "center" | "end";
  /**
   * When enabled, users cannot drag past snap intervals.
   * @default false
   */
  forceSnap?: boolean;
  /**
   * Enables momentum scrolling.
   * @default false
   */
  dragFree?: boolean;
}

export const carouselContext = createContext<EmblaCarouselType | null>(Symbol("carouselApi"));

@customElement("orbit-carousel")
export class OrbitCarousel extends LitElement {
  /**
   * Default options for all OrbitCarousel instances
   */
  static defaultOptions: CarouselOptions = {
    loop: false,
    alignSlides: "start",
    forceSnap: false,
    dragFree: false,
  };

  /**
   * Enable or disable infinite looping of the carousel.
   * @default false
   */
  @property({ type: Boolean })
  loop?: boolean;

  /**
   * Align the slides within the carousel.
   * @default start
   */
  @property({ attribute: "align-slides" })
  alignSlides?: "start" | "center" | "end";

  /**
   * When enabled, users cannot drag past snap intervals.
   * @default false
   */
  @property({ type: Boolean, attribute: "force-snap" })
  forceSnap?: boolean;

  /**
   * Enables momentum scrolling.
   * @default false
   */
  @property({ type: Boolean, attribute: "drag-free" })
  dragFree?: boolean;

  static styles = css`
    :host {
      display: block;
      overflow: hidden;
    }
  `;

  @provide({ context: carouselContext })
  private carouselApi: EmblaCarouselType | null = null;

  protected firstUpdated(): void {
    // Initialize carousel on first update after DOM is ready
    const options = this.buildCarouselOptions();
    this.carouselApi = EmblaCarousel(
      this,
      options,
      [WheelGesturesPlugin(), A11y()]
    );
  }

  protected willUpdate(changedProperties: PropertyValues<OrbitCarousel>): void {
    // Only handle reinitialization if carousel is already initialized
    if (!this.carouselApi) return;
    
    // Check if any carousel options have changed
    const optionProps: (keyof CarouselOptions)[] = [
      "loop", "alignSlides", "forceSnap", "dragFree"
    ];
    
    if (optionProps.some(prop => changedProperties.has(prop))) {
      this.carouselApi.reInit(this.buildCarouselOptions());
    }
  }

  private buildCarouselOptions(): EmblaOptionsType {
    const options = { ...OrbitCarousel.defaultOptions };
    
    // Only override with defined properties
    if (this.loop !== undefined) options.loop = this.loop;
    if (this.alignSlides !== undefined) options.alignSlides = this.alignSlides;
    if (this.forceSnap !== undefined) options.forceSnap = this.forceSnap;
    if (this.dragFree !== undefined) options.dragFree = this.dragFree;

    return {
      ...options,
      // account for some differences in property names / logic
      align: options.alignSlides,
      skipSnaps: !options.forceSnap,
    };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.carouselApi?.destroy();
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
