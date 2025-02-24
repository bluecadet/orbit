import { configs as litConfigs } from "eslint-plugin-lit";
import { configs as wcConfigs } from "eslint-plugin-wc";

import baseConfig from "@repo/eslint/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  {
    ...wcConfigs["flat/recommended"],
    settings: {
      wc: {
        elementBaseClasses: ["LitElement"],
      },
    },
  },
  litConfigs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/unbound-method": "off", // Lit automatically binds methods
    },
  },
];
