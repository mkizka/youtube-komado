import { configs } from "@mkizka/eslint-config";

export default [
  {
    ignores: [".output", ".wxt", "wxt.config.ts"],
  },
  ...configs.typescript(),
  ...configs.react(),
];
