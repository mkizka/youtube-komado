import { mkizka } from "@mkizka/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".output", ".wxt", "wxt.config.ts"]),
  mkizka,
]);
