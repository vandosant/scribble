module.exports = {
  entry: "./app/components/Main.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ],
    rules: [{
      test: require.resolve('jquery'),
      use: [{
          loader: 'expose-loader',
          options: '$'
      }]
    }]
  }
};
