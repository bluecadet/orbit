import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: [
    "src/orbit-parallax.ts",
    "src/orbit-motion-toggle.ts",
    "src/use-motion-preference.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: false,
  external: ["react", "motion"],
  ...options,
}));
