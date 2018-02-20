/* eslint-env node */

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FlowWebpackPlugin = require('flow-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isDev = process.env.BUILD_DEV === 'true';

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(isDev ? 'true' : 'false')),

  // this is necessary for the React and Invariant modules
  'process.env.NODE_ENV': isDev ? '"development"' : '"production"',

  'process.env.IS_TEST': 'false'
});

// CSS naming
let localIdentName = '[sha1:hash:base64]';
let getLocalIdent;
const componentPathPrefix = path.join(__dirname, 'packages');

// create names in development mode that are easy to read.
if (isDev) {
  localIdentName = '[path]__[local]';
  getLocalIdent = function(context, localIdentName, localName) {
    const file = (context.resourcePath || context.context)
      .substring(componentPathPrefix.length)
      .replace(/\/|\\|\./g, '_')
      .replace(/^_/, '')
      .replace(/_$/, '');
    return `${file}___${localName}`;
  };
}

module.exports = {
  entry: './packages/in-client/js/index.es6',
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
  plugins: [
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
  ],
  resolve: {
    extensions: ['.js', '.es6']
  }
};
