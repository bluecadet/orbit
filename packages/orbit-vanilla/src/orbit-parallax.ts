import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('orbit-parallax')
export class OrbitParallax extends LitElement {
  static styles = css`p { color: blue }`;

  name = 'Somebody';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}