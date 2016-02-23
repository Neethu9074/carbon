/* eslint-env node */
/* eslint-disable no-var, strict */
'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var definePlugin = new webpack.DefinePlugin({
  __INTERNAL__: JSON.stringify(JSON.parse(process.env.BUILD_INTERNAL || 'false')),
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),

  // this is necessary for the React and Invariant modules
  'process.env.NODE_ENV': process.env.BUILD_DEV === 'true' ? '"development"' : '"production"'
});

module.exports = {
  entry: './in-client/js/index.es6',
  output: {
    path: path.join(__dirname, 'target/assets/bundle/'),
    publicPath: 'bundle/',
    filename: 'index.js',
    chunkFilename: '[id].[hash].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.less$/i,
      loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 3 version!less', {
        // assets will be located next to the CSS file. Thus no need to prefix the path with
        // bundle/
        publicPath: './'
      })
    }, {
      test: /\.(ttf|eot|obj)$/i,
      loader: 'url?limit=3000'
    }, {
      test: /\.(jpe?g|gif|png|svg)$/i,
      loader: 'url?limit=3000!image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
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
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^$/),
    new ExtractTextPlugin('index.css')
  ],
  resolve: {
    extensions: ['', '.js', '.es6', '.ts']
  }
};
