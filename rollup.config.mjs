import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/import-image.ts",
  plugins: [typescript()],
  output: [
    {
      file: `dist/import-image.js`,
      format: "es",
      banner: "//! CODE_EDITOR",
    },
  ],
};
