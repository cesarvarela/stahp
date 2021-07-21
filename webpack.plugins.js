const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new copyWebpackPlugin({
    patterns: [
      { from: path.resolve(__dirname, 'src', 'assets'), to: path.resolve(__dirname, '.webpack', 'main', 'assets') },
      { from: path.resolve(__dirname, 'node_modules', 'stahp-theme-default', 'dist'), to: path.resolve(__dirname, '.webpack', 'main', 'themes', 'default') }
    ],
  }),
];
