import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import autoprefixer from "autoprefixer";
import CssNano from "cssnano";
import CleanWebpackPlugin from "clean-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

import baseConfig from "./webpack.config.base";
import {appTitle, backgroundColor, distPath} from "./constants";
import {root} from "./utils";
import env from "../env/prod";

const styleRule: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        minimize: false,
        sourceMap: false,
        importLoaders: 2,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        plugins: () => [autoprefixer],
        sourceMap: false,
      },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: false,
      },
    },
  ],
};

const imgRule: webpack.RuleSetRule = {
  test: /\.(jpg|png|gif)$/,
  loader: "file-loader",
  options: {
    regExp: /(img\/.*)/,
    name: "[name].[ext]",
    publicPath: "../",
    outputPath: "assets/img/",
  },
};

const fontRule: webpack.RuleSetRule = {
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  loader: "file-loader",
  options: {
    regExp: /(fonts\/.*)/,
    name: "[name].[ext]",
    publicPath: "../",
    outputPath: "fonts/",
  },
};

const prodRules: webpack.RuleSetRule[] = [styleRule, imgRule, fontRule];

const rules: webpack.RuleSetRule[] =
  baseConfig.module && baseConfig.module.rules
    ? baseConfig.module.rules.concat(prodRules)
    : prodRules;

// Plugins
const cleanPaths: string[] = [distPath];
const cleanOpts: CleanWebpackPlugin.Options = {
  root: root(""),
};
const clean: webpack.Plugin = new CleanWebpackPlugin(cleanPaths, cleanOpts);

const miniCssExtract: webpack.Plugin = new MiniCssExtractPlugin({
  filename: "css/[name].[contenthash].css",
  chunkFilename: "css/[name].[contenthash].css",
});

const optimizeCss: webpack.Plugin = new OptimizeCssAssetsPlugin({
  cssProcessor: CssNano,
  cssProcessorOptions: {
    discardUnused: false,
    discardComments: {removeAll: true},
  },
  canPrint: true,
});

const html: webpack.Plugin = new HtmlWebpackPlugin({
  inject: true,
  template: root("/src/index.html"),
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
});

const uglifyJs: webpack.Plugin = new UglifyJsPlugin({
  include: /.js$/,
  parallel: true,
  uglifyOptions: {
    warnings: true,
    output: {
      comments: false,
    },
  },
});

const compression: webpack.Plugin = new CompressionPlugin({
  test: /.js$/,
});

const define: webpack.Plugin = new webpack.DefinePlugin({
  "process.env": env,
});

const favicoConfig = {
  logo: root("/src/assets/img/favicon.png"),
  prefix: "icons/",
  persistentCache: false,
  inject: true,
  background: backgroundColor,
  appName: appTitle,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: false,
    favicons: true,
    firefox: true,
    opengraph: false,
    twitter: false,
    yandex: false,
    windows: false,
  },
};

const favico: webpack.Plugin = new FaviconsWebpackPlugin(favicoConfig);

const prodPlugins: webpack.Plugin[] = [
  clean,
  miniCssExtract,
  optimizeCss,
  html,
  compression,
  define,
  favico,
];

const plugins: webpack.Plugin[] = baseConfig.plugins
  ? baseConfig.plugins.concat(prodPlugins)
  : prodPlugins;

const splitChunks: webpack.Options.SplitChunksOptions = {
  // automaticNameDelimiter: "",
  chunks: "async",
  minSize: 30000,
  // maxSize: 0,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  name: true,
  cacheGroups: {
    vendors: {
      test: "/[\\/]node_modules[\\/]/",
      priority: -10,
    },
    default: {
      minChunks: Infinity,
      priority: -20,
      reuseExistingChunk: true,
    },
  },
};

const optimization: webpack.Options.Optimization = {
  ...baseConfig.optimization,
  minimizer: [uglifyJs],
  splitChunks,
};

const config: webpack.Configuration = {
  ...baseConfig,
  mode: "production",
  module: {
    rules,
  },
  plugins,
  optimization,
};

export default config;
