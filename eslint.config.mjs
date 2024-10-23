import { configs } from "@mkizka/eslint-config";

export default [
  {
    ignores: ["dist", "vite.config.ts"],
  },
  ...configs.typescript(),
  ...configs.react(),
  {
    rules: {
      "@typescript-eslint/no-deprecated": "off",
    },
  },
];
