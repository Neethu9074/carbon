/* eslint-env node */

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');

const {
  webpackPlugin: cssIdentWebpackPlugin,
  localIdentName,
  getLocalIdent
} = require('./build/webpack/cssIdentifiers');
const { isDevModeBuild } = require('./build/webpack/opts');
const hotReload = isDevModeBuild && !!process.env.HOT_RELOAD;

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(isDevModeBuild ? 'true' : 'false')),
  __HOT_RELOAD__: JSON.stringify(JSON.parse(hotReload ? 'true' : 'false')),

  // this is necessary for the React and Invariant modules
  'process.env.NODE_ENV': isDevModeBuild ? '"development"' : '"production"',

  'process.env.IS_TEST': 'false'
});

const plugins = [
  definePlugin,
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^$/),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // all options are optional
    filename: 'index.css',
    chunkFilename: '[id].[contenthash].css',
    // This is not completely sufficient. We also need to configure an ignore rule in
    // our custom Webpack dev mode output build/gulp/dev.js
    ignoreOrder: true
  }),
  new CaseSensitivePathsPlugin(),
  cssIdentWebpackPlugin,
  process.env.ANALYZE_BUNDLE && new BundleAnalyzerPlugin()
].filter(Boolean);

if (hotReload) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NamedModulesPlugin());
}

const entry = hotReload
  ? [
      'webpack-dev-server/client?https://local-instana.instana.io:4000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './packages/in-client/js/index.js'
    ]
  : './packages/in-client/js/index.js';

const miniCssLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: './',
    hmr: hotReload
  }
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    ident: 'postcss',
    plugins: () => {
      return [
        require('autoprefixer')({
          browsers: ['last 2 versions']
        })
      ];
    }
  }
};

module.exports = {
  entry,
  mode: process.env.NODE_ENV,
  context: __dirname,
  output: {
    path: path.join(__dirname, 'target/assets/bundle/'),
    publicPath: 'bundle/',
    filename: 'index.js',
    chunkFilename: '[name].[contenthash].js'
  },
  devtool: isDevModeBuild ? 'eval' : 'source-map',
  module: {
    rules: [
      {
        test: /\.(ttf|eot|obj)$/i,
        use: [{ loader: 'url-loader?limit=3000' }]
      },
      {
        test: /\.mless$/i,
        use: [
          miniCssLoader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName,
              getLocalIdent
            }
          },
          postCssLoader,
          'less-loader'
        ]
      },
      {
        test: /\.(css|less)$/i,
        use: [miniCssLoader, 'css-loader', postCssLoader, 'less-loader']
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [{ loader: 'url-loader?limit=3000!image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false' }]
      },
      {
        test: /\.glsl$/i,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.yaml$/i,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.mmd$/,
        use: [
          {
            loader: 'json-loader'
          },
          {
            loader: 'meta-marked-loader'
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader!markdown-loader'
          }
        ]
      },
      {
        test: /\.woff?$/,
        use: [
          {
            loader: 'url-loader?limit=3000&mimetype=application/font-woff'
          }
        ]
      }
    ]
  },
  plugins,
  resolve: {
    extensions: ['.js']
  }
};
