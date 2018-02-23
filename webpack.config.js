const path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var package = require('./package.json');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
  entry: {
    app: "./components/Main.js"
  },
  watch: true,
  output: {
    filename: "./public/bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "./dist/"),
    port: 9000
  },
  output: {
    path: path.join(__dirname, "./dist/"),
    filename: "[name].bundle.js",
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'shared',
      minChunks: 2
    }),
    new HtmlWebpackPlugin({
        hash: true,
        title: 'My Awesome application',
        myPageHeader: 'Hello World',
        template: './src/index.html',
        chunks: ['vendor', 'shared', 'app'],
        path: path.join(__dirname, "./dist/"),
        filename: 'index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ],
    rules: [
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: '$'
        }]
      },
      {
        test:/\.scss$/,
        use: ['style-loader','css-loader', 'sass-loader']
      }
    ]
  }
};
