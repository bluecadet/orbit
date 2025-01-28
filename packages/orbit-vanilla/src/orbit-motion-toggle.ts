import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { motionPreference, MotionAwareElement } from './motion-preference';

/**
 * A toggle button for controlling motion preferences.
 * Respects system preferences and persists user choices.
 * 
 * @example
 * ```html
 * <orbit-motion-toggle></orbit-motion-toggle>
 * ```
 */
@customElement('orbit-motion-toggle')
export class OrbitMotionToggle extends MotionAwareElement {
  private handleToggle() {
    motionPreference.setReducedMotion(!motionPreference.reducedMotion);
  }

  protected render() {
    return html`
      <button
        type="button"
        role="switch"
        aria-checked=${motionPreference.reducedMotion}
        @click=${this.handleToggle}
      >
        <slot>Reduce Motion</slot>
      </button>
    `;
  }
}
