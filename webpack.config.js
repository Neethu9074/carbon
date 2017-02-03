/* eslint-env node */

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),

  // this is necessary for the React and Invariant modules
  'process.env.NODE_ENV': process.env.BUILD_DEV === 'true' ? '"development"' : '"production"',

  'process.env.IS_TEST': 'false'
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
      test: /\.(css|less)$/i,
      loader: ExtractTextPlugin.extract('style', 'css!postcss!less', {
        // assets will be located next to the CSS file. Thus no need to prefix the path with bundle/
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
      test: /\.yaml$/i,
      loader: 'raw'
    }, {
      test: /\.json$/i,
      loader: 'json'
    }, {
      test: /\.mmd$/,
      loader: 'json!meta-marked'
    }, {
      test: /\.md$/,
      loader: 'html!markdown'
    }, {
      test: /\.woff?$/,
      loader: 'url?limit=3000&mimetype=application/font-woff'
    }]
  },
  postcss: [
    autoprefixer({browsers: ['last 2 versions']})
  ],
  plugins: [
    definePlugin,
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^$/),
    new ExtractTextPlugin('index.css'),
    new CaseSensitivePathsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.es6', '.ts']
  }
};
