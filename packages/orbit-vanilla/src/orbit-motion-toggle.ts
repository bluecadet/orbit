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
 *   <span slot="enable-label">Turn on animations</span>
 *   <span slot="disable-label">Turn off animations</span>
 * </orbit-motion-toggle>
 * ```
 */
@customElement("orbit-motion-toggle")
export class OrbitMotionToggle extends MotionAwareElement {
  private handleToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    motionPreference.setReducedMotion(checked);
  }

  protected render() {
    return html`
      <label class="motion-toggle">
        <input
          type="checkbox"
          .checked=${motionPreference.reducedMotion}
          @change=${this.handleToggle}
        />
        <span class="label">
          <slot name="enable-label" ?hidden=${!motionPreference.reducedMotion}>
            Enable motion
          </slot>
          <slot name="disable-label" ?hidden=${motionPreference.reducedMotion}>
            Disable motion
          </slot>
        </span>
      </label>
    `;
  }
}
