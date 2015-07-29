/*eslint-env node */
/*eslint-disable no-var*/
'use strict';

var webpack = require('webpack');
var path = require('path');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),

  __DEMO__: JSON.stringify(JSON.parse(process.env.TARGET_ENVIRONMENT === 'demo')),

  // this is necessary for the React and Invariant modules
  'process.env.NODE_ENV': process.env.BUILD_DEV === 'true' ? '"development"' : '"production"'
});

module.exports = {
  entry: './in-client/js/index.es6',
  output: {
    path: path.join(__dirname, 'target/bundle/'),
    publicPath: 'bundle/',
    filename: 'index.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.less$/i,
      loader: 'style!css!autoprefixer?browsers=last 2 version!less'
    }, {
      test: /\.(jpe?g|gif|png|svg|ttf|eot|obj)$/i,
      loader: 'url?limit=3000'
    }, {
      test: /\.glsl$/i,
      loader: 'raw'
    }, {
      test: /\.es6$/i,
      loader: 'babel'
    }, {
      test: /\.djs$/,
      loader: 'dogescript'
    }, {
      test: /\.md$/,
      loader: 'html!markdown'
    }, {
      test: /\.woff?$/,
      loader: 'url?limit=3000&mimetype=application/font-woff'
    }]
  },
  plugins: [
    definePlugin,
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^$/)
  ],
  resolve: {
    extensions: ['', '.js', '.es6']
  }
};
