const webpack = require('webpack')
const path = require('path')
const assetsWebpackPlugin = require('assets-webpack-plugin')

module.exports = {
  entry: [
    './src/client/index.js'
  ],
  output: {
    filename: 'bundle.[chunkhash].js',
    path: path.join(__dirname, '../public/js'),
    publicPath: '/js/'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'client': path.resolve(__dirname, '../src/client'),
      'components': path.resolve(__dirname, '../src/client/components'),
      'store': path.resolve(__dirname, '../src/client/store')
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, './src/client'),
        loader: 'babel-loader',
        query: { presets: ['es2015'] }
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new assetsWebpackPlugin({ path: path.join(__dirname, '../public/js') }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),
  ]
}
