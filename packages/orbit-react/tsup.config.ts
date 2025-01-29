import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/orbit-parallax.ts", "src/orbit-motion-toggle.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: ["react"],
  ...options,
}));
