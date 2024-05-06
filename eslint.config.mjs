import { mkizka } from "@mkizka/eslint-config";

export default [
  {
    ignores: ["dist", "vite.config.ts"],
  },
  ...mkizka(),
];
