const path = require('path');

module.exports = {
  outputDir: 'build/public',
  chainWebpack: config => {
    config.plugin('html').tap(() => [
      {
        template: path.resolve('client/public/index.html'),
      },
    ]);
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'client', 'src'),
      },
    },
    entry: {
      app: path.join(__dirname, 'client', 'src', 'main.js'),
    },
  },
};
