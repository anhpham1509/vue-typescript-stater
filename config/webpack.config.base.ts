import webpack from "webpack";
// import CopyWebpackPlugin from "copy-webpack-plugin";
import {root} from "./utils";
import {distPath} from "./constants";

const entry: webpack.Entry = {
  main: root("/src/index.ts"),
};

const output: webpack.Output = {
  path: distPath,
  filename: "js/[name].[hash].js",
  chunkFilename: "js/[name].[hash].js",
  publicPath: "/",
};

const resolve: webpack.Resolve = {
  modules: [root("/node_modules")],
  extensions: [".js", ".ts", ".vue"],
  alias: {
    vue$: "vue/dist/vue.esm.js",
  },
};

const tsRule: webpack.RuleSetRule = {
  test: /.ts$/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
    {
      loader: "ts-loader",
    },
  ],
  enforce: "pre",
  exclude: /node_modules/,
};

const templateRule: webpack.RuleSetRule = {
  test: /.template$/,
  loader: "raw-loader",
};

const rules: webpack.RuleSetRule[] = [tsRule, templateRule];

// const copy = new CopyWebpackPlugin([
//   {
//     from: "src/assets",
//     to: "./assets",
//   },
// ]);

const plugins: webpack.Plugin[] = [];

const optimization: webpack.Options.Optimization = {
  namedModules: true,
  noEmitOnErrors: true,
  concatenateModules: true,
};

const baseConfig: webpack.Configuration = {
  context: root(""),
  entry,
  output,
  devtool: "source-map",
  resolve,
  module: {
    rules,
  },
  plugins,
  optimization,
};

export default baseConfig;
