import type { StorybookConfig } from "@storybook/web-components-vite";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],

  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },

  docs: {
    autodocs: true,
  },
};
export default config;
