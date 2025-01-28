import type { StorybookConfig } from "@storybook/web-components-vite";

import { join, dirname } from "path";
import { fileURLToPath } from "url";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return fileURLToPath(dirname(import.meta.resolve(join(value, 'package.json'))));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {},
  },
};
export default config;
