const { resolve } = require("path");
const GlobEntriesPlugin = require("webpack-watched-glob-entries-plugin");

module.exports = {
  webpack: (config) => {
    config.resolve.extensions.push(".ts");
    config.resolve.extensions.push(".tsx");
    config.entry = GlobEntriesPlugin.getEntries([
      resolve("app", "?(scripts)/*.{ts,tsx}"),
    ]);
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: "ts-loader",
    });
    return config;
  },
  copyIgnore: ["**/*.ts", "**/*.tsx"],
};
