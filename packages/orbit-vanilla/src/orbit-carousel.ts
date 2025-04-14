import type { EmblaCarouselType } from "embla-carousel";
import A11y from "@bluecadet/embla-carousel-a11y";
import { createContext, provide } from "@lit/context";
import EmblaCarousel from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

interface CarouselOptions {
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
   * Allow users to drag past snap intervals.
   * @default true
   */
  skipSnaps?: boolean;
  /**
   * Enables momentum scrolling.
   * @default false
   */
  dragFree?: boolean;
}

const carouselContext = createContext<EmblaCarouselType | null>("carouselApi");

@customElement("orbit-carousel")
export class OrbitCarousel extends LitElement {
  /**
   * Default options for all OrbitCarousel instances
   */
  static defaultOptions: CarouselOptions = {
    loop: false,
    alignSlides: "start",
    skipSnaps: true,
    dragFree: false,
  };

  /**
   * Enable or disable infinite looping of the carousel
   * @default false
   */
  @property({ type: Boolean })
  loop?: boolean;

  /**
   * Align the slides within the carousel
   * @default start
   */
  @property({ attribute: "align-slides" })
  alignSlides?: "start" | "center" | "end";

  /**
   * Allow users to drag past snap intervals.
   * @default true
   */
  @property({ type: Boolean, attribute: "skip-snaps" })
  skipSnaps?: boolean;

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

  protected willUpdate(changedProperties: PropertyValues<OrbitCarousel>): void {
    // Build options object based on current property values
    const options = this.buildCarouselOptions();
    
    if (!this.carouselApi) {
      // Initialize carousel on first update
      this.carouselApi = EmblaCarousel(
        this,
        options,
        [WheelGesturesPlugin(), A11y()]
      );
      return;
    }

    // Check if any carousel options have changed
    const optionProps: (keyof CarouselOptions)[] = [
      "loop", "alignSlides", "skipSnaps", "dragFree"
    ];
    
    if (optionProps.some(prop => changedProperties.has(prop))) {
      this.carouselApi.reInit(options);
    }
  }

  private buildCarouselOptions(): CarouselOptions {
    const options = { ...OrbitCarousel.defaultOptions };
    
    // Only override with defined properties
    if (this.loop !== undefined) options.loop = this.loop;
    if (this.alignSlides !== undefined) options.alignSlides = this.alignSlides;
    if (this.skipSnaps !== undefined) options.skipSnaps = this.skipSnaps;
    if (this.dragFree !== undefined) options.dragFree = this.dragFree;
    
    return options;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.carouselApi?.destroy();
  }

  protected render() {
    return html`<slot></slot>`;
  }
}
