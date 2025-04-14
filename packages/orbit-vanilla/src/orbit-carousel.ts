import type { EmblaCarouselType } from "embla-carousel";
import A11y from "@bluecadet/embla-carousel-a11y";
import { consume, createContext, provide } from "@lit/context";
import EmblaCarousel from "embla-carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

const carouselContext = createContext<EmblaCarouselType | null>("carouselApi");

@customElement("orbit-carousel")
export class OrbitCarousel extends LitElement {
  static styles = css`
    :host {
      display: block;
      overflow: hidden;
    }
  `;

  @provide({ context: carouselContext })
  private carouselApi: EmblaCarouselType | null = null;

  connectedCallback() {
    super.connectedCallback();

    const container = this.querySelector<HTMLElement>(
      '[data-orbit-part="carousel-container"]',
    )!;
    const slides = this.querySelectorAll<HTMLElement>(
      '[data-orbit-part="carousel-container"] > *',
    );

    this.carouselApi = EmblaCarousel(
      this,
      {
        container,
        slides,
        align: "start",
        skipSnaps: true,
      },
      [WheelGesturesPlugin(), A11y()],
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.carouselApi?.destroy();
  }

  protected render() {
    return html` <slot></slot> `;
  }
}

@customElement("orbit-carousel-controls")
export class OrbitCarouselControls extends LitElement {
  @consume({ context: carouselContext })
  private carouselApi?: EmblaCarouselType | null;

  @state()
  private canScrollPrev = false;

  @state()
  private canScrollNext = false;

  connectedCallback() {
    super.connectedCallback();
    this._onSelect = this._onSelect.bind(this);
    this.carouselApi?.on("select", this._onSelect);
    this.carouselApi?.on("init", this._onSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.carouselApi?.off("select", this._onSelect);
    this.carouselApi?.off("init", this._onSelect);
  }

  private _onSelect(emblaApi: EmblaCarouselType) {
    this.canScrollPrev = emblaApi.canScrollPrev() ?? false;
    this.canScrollNext = emblaApi.canScrollNext() ?? false;
  }

  private _prevClick() {
    this.carouselApi?.scrollPrev(false);
  }

  private _nextClick() {
    this.carouselApi?.scrollNext(false);
  }

  protected render() {
    return html`
      <button @click=${this._prevClick} ?disabled=${!this.canScrollPrev}>
        <slot name="previous">Previous</slot>
      </button>
      <button @click=${this._nextClick} ?disabled=${!this.canScrollNext}>
        <slot name="next">Next</slot>
      </button>
    `;
  }
}

@customElement("orbit-carousel-progress")
export class OrbitCarouselProgress extends LitElement {
  @consume({ context: carouselContext })
  private carouselApi?: EmblaCarouselType | null;

  @state()
  private current = 0;

  connectedCallback() {
    super.connectedCallback();

    this.carouselApi?.on("select", () => {
      this.current = this.carouselApi?.selectedScrollSnap() ?? 0;
    });
  }

  get total() {
    return this.carouselApi?.slideNodes().length ?? 0;
  }

  protected render() {
    return html`
      <span>${this.current + 1}</span>
      <slot name="separator">/</slot>
      <span>${this.total}</span>
    `;
  }
}
