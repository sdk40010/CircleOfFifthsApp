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
  }
};