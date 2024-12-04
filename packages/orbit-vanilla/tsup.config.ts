import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: [
    "src/orbit-parallax.ts"
  ],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: ["lit"],
  ...options,
}));