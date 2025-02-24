import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { MotionAwareElement, motionPreference } from "./motion-preference";

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
export class OrbitMotionToggle extends MotionAwareElement {
  private handleToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    motionPreference.setReducedMotion(!checked);
  }

  protected render() {
    return html`
      <label class="motion-toggle">
        <input
          type="checkbox"
          .checked=${!motionPreference.reducedMotion}
          @change=${this.handleToggle}
        />
        <span class="label">
          <slot name="enabled-label" ?hidden=${motionPreference.reducedMotion}>
            Motion enabled
          </slot>
          <slot name="disabled-label" ?hidden=${!motionPreference.reducedMotion}>
            Motion disabled
          </slot>
        </span>
      </label>
    `;
  }
}
