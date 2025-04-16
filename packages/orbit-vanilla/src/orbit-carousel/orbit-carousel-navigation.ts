import type { EmblaCarouselType } from "embla-carousel";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { CarouselConsumerMixin } from "./orbit-carousel-consumer";

@customElement("orbit-carousel-navigation")
export class OrbitCarouselNavigation extends CarouselConsumerMixin(LitElement) {
  @property({ type: String })
  public direction: "prev" | "next" = "prev";

  @state()
  private _canScroll = false;

  private get isPrev(): boolean {
    return this.direction === "prev";
  }

  constructor() {
    super();
    // Bind methods to preserve 'this' context in event handlers
    this._onSelect = this._onSelect.bind(this);
  }

  private _handleClick() {
    if (this.isPrev) {
      this.carouselApi?.scrollPrev();
    } else {
      this.carouselApi?.scrollNext();
    }
  }

  private _onSelect(emblaApi: EmblaCarouselType) {
    if (this.isPrev) {
      this._canScroll = emblaApi.canScrollPrev() ?? false;
    } else {
      this._canScroll = emblaApi.canScrollNext() ?? false;
    }
  }

  protected carouselConnected(api: EmblaCarouselType): void {
    // Subscribe to carousel events
    api.on("select", this._onSelect);
    api.on("init", this._onSelect);

    // Initialize state immediately if the carousel is already initialized
    if (api.internalEngine()) {
      this._onSelect(api);
    }
  }

  protected carouselDisconnected(api: EmblaCarouselType): void {
    // Unsubscribe from carousel events
    api.off("select", this._onSelect);
    api.off("init", this._onSelect);
    this._canScroll = false;
  }

  protected render() {
    return html`
      <button ?disabled=${!this._canScroll} @click=${this._handleClick}>
        <slot> ${this.isPrev ? "Previous" : "Next"} </slot>
      </button>
    `;
  }
}
