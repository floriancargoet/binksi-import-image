import esbuild from "rollup-plugin-esbuild";

export default {
  input: "src/import-image.ts",
  plugins: [esbuild()],
  output: [
    {
      file: `dist/import-image.js`,
      format: "iife",
      indent: false,
      extend: false,
      banner: "//! CODE_EDITOR",
    },
  ],
};
