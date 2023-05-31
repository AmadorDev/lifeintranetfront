require("dotenv").config();
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  generateEtags: false,
  // target: "server",
  // distDir: "build",

  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    // config.plugins.push(
    //   new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery",
    //   })
    // );
    return config;
  },
};
