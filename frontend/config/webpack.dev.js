const { merge } = require('webpack-merge');
const paths = require('./paths.js');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  devServer: {
    historyApiFallback: true,
    static: {
      directory: paths.build,
    },
    compress: true,
    host: process.env.HOST,
    port: 8080
  }
});
