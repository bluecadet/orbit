import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('orbit-test')
export class OrbitTest extends LitElement {
  static styles = css`p { color: red }`;

  render() {
    return html`<p>Foo Bar!</p>`;
  }
}