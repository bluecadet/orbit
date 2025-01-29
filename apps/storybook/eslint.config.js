import baseConfig from "@repo/eslint/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  {
    files: [".storybook/*.{js,mjs,cjs,ts}"],
  },
  ...baseConfig,
];
