import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '@bluecadet/orbit-vanilla/custom-elements.json';
import type { Preview } from "@storybook/web-components";

import "./styles.css";

setCustomElementsManifest(customElements);

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
