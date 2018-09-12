/* eslint-disable */
const path = require('path');
const assetsWebpackPlugin = require('assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'production',
  entry: [
    './src/client/index.js',
  ],
  output: {
    filename: 'bundle.[chunkhash].js',
    path: path.join(__dirname, '../public/js'),
    publicPath: '/js/',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.common.js',
      src: path.resolve(__dirname, '../src'),
      client: path.resolve(__dirname, '../src/client'),
      components: path.resolve(__dirname, '../src/client/components'),
      store: path.resolve(__dirname, '../src/client/store'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {},
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, './src/client'),
        exclude: /node_modules/,
        query: { presets: ['es2015'] },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new assetsWebpackPlugin({ path: path.join(__dirname, '../public/js') }),
  ],
};
