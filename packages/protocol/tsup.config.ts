import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/injection.ts", "src/lifecycle.ts", "src/paths.ts", "src/constants.ts", "src/schema.ts", "src/types.ts"],
  format: ["esm"],
  splitting: true,
  dts: { compilerOptions: { composite: false } },
  target: "es2022",
  external: ["zod"],
  clean: true,
});
