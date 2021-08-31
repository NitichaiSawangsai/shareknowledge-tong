var webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      VERSION: JSON.stringify(process.env.VERSION),
      DOMAIN: JSON.stringify(process.env.DOMAIN),
      API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
    },
  }),
];

module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "webTong";
      args[0].meta = {
        "webtong-version": process.env.VERSION,
      };
      return args;
    });
  },
  configureWebpack: {
    devtool: "source-map",
    plugins: plugins,
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              defaults: false,
              drop_console: false,
            },
            output: {
              ecma: 5,
              comments: false,
            },
          },
          parallel: true,
          //   sourceMap: false
          //   cache: true,
        }),
      ],
    },
  },
  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // as of sass-loader 8, `data` needs to be `prependData`.
        prependData: `@import "@/assets/scss/index.scss";`,
      },
    },
  },
  transpileDependencies: ["vuex-persist"],
};
