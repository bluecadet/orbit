import type { EmblaCarouselType } from "embla-carousel";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { CarouselConsumerMixin } from "./orbit-carousel-consumer";

@customElement("orbit-carousel-progress")
export class OrbitCarouselProgress extends CarouselConsumerMixin(LitElement) {
  @state()
  private current = 0;

  private get currentElement() {
    return this.querySelector("[data-orbit-current]");
  }

  private get totalElement() {
    return this.querySelector("[data-orbit-total]");
  }

  private get total() {
    return this.carouselApi?.slideNodes().length ?? 0;
  }

  constructor() {
    super();
    // Bind methods to preserve 'this' context in event handlers
    this._onSelect = this._onSelect.bind(this);
  }

  private _onSelect(emblaApi: EmblaCarouselType) {
    this.current = emblaApi.selectedScrollSnap() ?? 0;

    if (this.currentElement) {
      this.currentElement.textContent = String(this.current + 1);
    }
    if (this.totalElement) {
      this.totalElement.textContent = String(this.total);
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
  }

  render() {
    return html`<slot></slot>`;
  }
}
