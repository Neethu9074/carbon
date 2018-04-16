/* eslint-env node */

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FlowWebpackPlugin = require('flow-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const {
  localIdentName,
  getLocalIdent,
  webpackPlugin: cssIdentWebpackPlugin
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
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^$/),
  new ExtractTextPlugin({
    filename: 'index.css',
    disable: false,
    allChunks: true
  }),
  new CaseSensitivePathsPlugin(),
  new FlowWebpackPlugin({
    failOnError: true
  }),
  cssIdentWebpackPlugin
];

if (hotReload) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NamedModulesPlugin());
}

const entry = hotReload
  ? [
      'webpack-dev-server/client?https://local-instana.instana.io:4000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './packages/in-client/js/index.es6'
    ]
  : './packages/in-client/js/index.es6';

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'target/assets/bundle/'),
    publicPath: 'bundle/',
    filename: 'index.js',
    chunkFilename: '[name].[hash].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ttf|eot|obj)$/i,
        use: [{ loader: 'url-loader?limit=3000' }]
      },
      {
        test: /\.mless$/i,
        // assets will be located next to the CSS file. Thus no need to prefix the path with bundle/
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName,
                getLocalIdent
              }
            },
            {
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
            },
            {
              loader: 'less-loader'
            }
          ],
          publicPath: './'
        })
      },
      {
        test: /\.(css|less)$/i,
        // assets will be located next to the CSS file. Thus no need to prefix the path with bundle/
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
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
            },
            {
              loader: 'less-loader'
            }
          ],
          publicPath: './'
        })
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
        test: /\.es6$/i,
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
        test: /\.json$/i,
        use: [
          {
            loader: 'json-loader'
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
    extensions: ['.js', '.es6']
  }
};
