/*eslint-env node */
'use strict';

var webpack = require('webpack');
var path = require('path');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),

  // this is necessary for the React and Invariant modules
  'process.env.NODE_ENV': process.env.BUILD_DEV === 'true' ? '"development"' : '"production"'
});

module.exports = {
  entry: './src/js/index.es6',
  output: {
    path: path.join(__dirname, 'target/bundle/'),
    publicPath: 'bundle/',
    filename: 'index.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.less$/i,
      loader: 'style-loader!css-loader!less-loader'
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot|\.obj$/i,
      loader: 'file-loader'
    }, {
      test: /\.glsl$/i,
      loader: 'raw-loader'
    }, {
      test: /\.es6$/i,
      loader: 'babel-loader'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }]
  },
  plugins: [
    definePlugin
  ],
  resolve: {
    extensions: ['', '.js', '.es6']
  }
};
