import type { Preview } from "@storybook/web-components";
import customElements from "@bluecadet/orbit-vanilla/custom-elements.json";
import { setCustomElementsManifest } from "@storybook/web-components";
import { prettify } from "htmlfy";

import theme from "./theme";

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
    docs: {
      theme,
      source: {
        transform: (src: string) => {
          // fix indentation/formatting from lit html
          return prettify(src);
        },
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: ["Introduction", "Installation", "Components"],
      },
    },
  },
};

export default preview;
