import typescript from "rollup-plugin-typescript2";
import svgo from "rollup-plugin-svgo";

export default {
  input: "src/import-image/import-image.ts",
  plugins: [
    typescript({
      clean: true,
    }),
    svgo({
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              // viewBox is required to resize SVGs with CSS.
              // @see https://github.com/svg/svgo/issues/1128
              removeViewBox: false,
            },
          },
        },
      ],
    }),
  ],
  output: [
    {
      file: `dist/import-image.js`,
      format: "es",
      banner: "//! CODE_EDITOR",
    },
  ],
};
