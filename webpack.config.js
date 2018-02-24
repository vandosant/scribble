const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

module.exports = {
  entry: {
    app: './components/Main.js'
  },
  watch: true,
  output: {
    path: path.join(__dirname, './dist/'),
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, './dist/'),
    port: 9000
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
      path: path.join(__dirname, './dist/'),
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
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
