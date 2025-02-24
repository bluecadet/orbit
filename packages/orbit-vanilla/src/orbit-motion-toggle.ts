import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { MotionPreferenceController } from "./motion-preference";

/**
 * A toggle checkbox for controlling motion preferences.
 * Respects system preferences and persists user choices.
 *
 * @example
 * ```html
 * <orbit-motion-toggle>
 *   <span slot="enabled-label">Turn on animations</span>
 *   <span slot="disabled-label">Turn off animations</span>
 * </orbit-motion-toggle>
 * ```
 */
@customElement("orbit-motion-toggle")
export class OrbitMotionToggle extends LitElement {
  private reduceMotionController = new MotionPreferenceController(this);

  private handleToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.reduceMotionController.setReducedMotion(!checked);
  }

  protected render() {
    return html`
      <label class="motion-toggle">
        <input
          type="checkbox"
          .checked=${!this.reduceMotionController.reduce}
          @change=${this.handleToggle}
        />
        <span class="label">
          <slot
            name="enabled-label"
            ?hidden=${this.reduceMotionController.reduce}
          >
            Motion enabled
          </slot>
          <slot
            name="disabled-label"
            ?hidden=${!this.reduceMotionController.reduce}
          >
            Motion disabled
          </slot>
        </span>
      </label>
    `;
  }
}
