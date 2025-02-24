import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: [
    "src/orbit-parallax.ts",
    "src/orbit-motion-toggle.ts",
    "src/motion-preference.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: ["lit", "motion"],
  ...options,
}));
