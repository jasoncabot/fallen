const paths = require('./paths')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,
    open: true,
    compress: true,
    hot: true,
    host: process.env.HOST,
    port: 8080,
    proxy: { // Hacky way of simulating POST to API in dev that creates a game with id = 1
      '/assets/api/games': {
        bypass: (req, res) => {
          if (req.method === 'POST') {
            res.end(JSON.stringify({ id: 1 }));
          }
        }
      }
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
