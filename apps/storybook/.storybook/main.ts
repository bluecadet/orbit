import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/web-components-vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-essentials")],

  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {
      builder: {
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },

  docs: {
    autodocs: true,
  },
};
export default config;

function getAbsolutePath(value: string): string {
  const dir = dirname(import.meta.resolve(join(value, "package.json")));
  return fileURLToPath(dir);
}
