import { configs } from "@mkizka/eslint-config";

export default [
  {
    ignores: [".output", ".wxt", "wxt.config.ts"],
  },
  ...configs.typescript(),
  ...configs.react(),
  {
    rules: {
      "@typescript-eslint/no-deprecated": "off",
    },
  },
];
