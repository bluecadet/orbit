import type { Preview } from "@storybook/web-components";
import customElements from "@bluecadet/orbit-vanilla/custom-elements.json";
import { setCustomElementsManifest } from "@storybook/web-components";
import theme from "./theme";

import "./styles.css";

setCustomElementsManifest(customElements);

const preview: Preview = {
  parameters: {
    docs: {
      theme
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: [
    'autodocs',
  ]
};

export default preview;
