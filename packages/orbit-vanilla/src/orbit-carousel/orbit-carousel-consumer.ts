/* eslint-disable @typescript-eslint/no-unused-vars */
import { consume } from "@lit/context";
import { type EmblaCarouselType } from "embla-carousel";
import { LitElement } from "lit";
import { state } from "lit/decorators.js";
import { carouselContext } from "./orbit-carousel";


// eslint-disable-next-line
type Constructor<T = {}> = new (...args: any[]) => T;

declare class CarouselConsumerInterface {
  protected carouselApi?: EmblaCarouselType | null;
  protected carouselConnected(api: EmblaCarouselType): void;
  protected carouselDisconnected(api: EmblaCarouselType): void;
}

/**
 * Mixin that adds carousel API subscription handling to a LitElement
 */
export const CarouselConsumerMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class CarouselConsumerElement extends superClass {
    @consume({ context: carouselContext, subscribe: true })
    @state()
    protected carouselApi?: EmblaCarouselType | null;

    updated(changedProperties: Map<string, unknown>) {
      super.updated?.(changedProperties);
  
      if (changedProperties.has("carouselApi")) {
        const oldCarouselApi = changedProperties.get("carouselApi") as EmblaCarouselType | undefined;
  
        if (oldCarouselApi) {
          // Call disconnected handler if API exists
          this.carouselDisconnected(oldCarouselApi);
        }
  
        if (this.carouselApi) {
          // Call connected handler if API exists
          this.carouselConnected(this.carouselApi);
        }
      }
    }

    /**
     * Override this method to handle when a carousel API becomes available
     * @param api The carousel API instance
     */
    protected carouselConnected(api: EmblaCarouselType): void {
      // Implementation in subclass
    }

    /**
     * Override this method to handle when a carousel API is removed
     * @param api The carousel API instance being removed
     */
    protected carouselDisconnected(api: EmblaCarouselType): void {
      // Implementation in subclass
    }

    disconnectedCallback() {
      // Call remove handler if API exists
      if (this.carouselApi) {
        this.carouselDisconnected(this.carouselApi);
      }
      super.disconnectedCallback();
    }
  }
  
  return CarouselConsumerElement as unknown as Constructor<CarouselConsumerInterface> & T;
}