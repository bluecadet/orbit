import type { Preview } from "@storybook/web-components";
import customElements from "@bluecadet/orbit-vanilla/custom-elements.json" assert { type: "json" };
import { setCustomElementsManifest } from "@storybook/web-components";

import "./styles.css";

// strip members from modules, as storybook displays them in the controls,
// and in most cases it's not useful to have them there.
const modifiedElementManifest = {
  ...customElements,
  modules: customElements.modules.map((module) => ({
    ...module,
    declarations: module.declarations.map((declaration) => ({
      ...declaration,
      // TBD, we might want to be more selective, rather than just
      // hiding EVERY member
      members: [],
    })),
  })),
};

setCustomElementsManifest(modifiedElementManifest);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
