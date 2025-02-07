const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const historyApiFallback = require("connect-history-api-fallback");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    bundle: path.resolve(__dirname, "frontend/src/index.js"),
    home: path.resolve(__dirname, "frontend/src/js/home.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "[name].[contenthash].js",
    clean: true,
    assetModuleFilename: "assets/[name][ext]",
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Twitter",
      filename: "index.html",
      template: "frontend/src/index.html",
      chunks: ["bundle"],
    }),
    new HtmlWebpackPlugin({
      title: "Home",
      filename: "home.html",
      template: "frontend/src/pages/home.html",
      chunks: ["home"],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "frontend/src/assets", to: "assets" }],
    }),
  ],
};
