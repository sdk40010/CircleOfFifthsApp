const webpack = require('webpack');

module.exports = {
  context: __dirname + '/app',
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
          presets: ['@babel/preset-env']
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