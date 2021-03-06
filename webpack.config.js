const webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  entry: './entry',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  mode: 'none',
  watch: true,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        }
      }
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default']
    })
  ]
};