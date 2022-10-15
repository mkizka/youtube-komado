import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import zip from "rollup-plugin-zip";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [react(), crx({ manifest }), zip()],
});
