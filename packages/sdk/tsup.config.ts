import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: { compilerOptions: { composite: false } },
  target: "es2022",
  noExternal: [/@roam\/.*/],
  external: ["yaml"],
  clean: true,
});
