import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";

import baseConfig from "./webpack.config.base";
import {root} from "./utils";
import env from "../env/dev";

const styleRule: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
    },
    {
      loader: "sass-loader",
    },
  ],
};

const assetRule: webpack.RuleSetRule = {
  test: "/.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/",
  loader: "file-loader",
};

const devRules: webpack.RuleSetRule[] = [styleRule, assetRule];

const rules: webpack.RuleSetRule[] =
  baseConfig.module && baseConfig.module.rules
    ? baseConfig.module.rules.concat(devRules)
    : devRules;

const html: webpack.Plugin = new HtmlWebpackPlugin({
  inject: true,
  template: root("/src/index.html"),
});

const define: webpack.Plugin = new webpack.DefinePlugin({
  "process.env": env,
});

// hot module replacement plugin for hot mode in dev server
const hmr: webpack.Plugin = new webpack.HotModuleReplacementPlugin();

const devPlugins: webpack.Plugin[] = [html, define, hmr];

const plugins: webpack.Plugin[] = baseConfig.plugins
  ? baseConfig.plugins.concat(devPlugins)
  : devPlugins;

const devServer: webpackDevServer.Configuration = {
  hot: true,
  inline: true,
  port: 8080,
  host: "0.0.0.0",
  publicPath: "/",
  historyApiFallback: true,
  overlay: {
    warnings: true,
    errors: true,
  },
  contentBase: root("/src"),
  stats: "errors-only",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  open: true,
};

const config: webpack.Configuration = {
  ...baseConfig,
  mode: "development",
  module: {
    rules,
  },
  plugins,
  devServer,
};

export default config;
