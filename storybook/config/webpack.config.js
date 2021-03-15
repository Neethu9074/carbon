/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

const webpack = require('webpack');
const {
  webpackPlugin: cssIdentWebpackPlugin,
  localIdentName,
  getLocalIdent
} = require('../../build/webpack/cssIdentifiers');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

// This is a modified set of loaders. It specifically excludes some special cases around CSS extraction
// and CSS names.
const necessaryLoaders = [
  {
    test: /\.(ttf|eot|obj)$/i,
    use: [{ loader: 'url-loader?limit=3000' }]
  },
  {
    test: /\.mless$/i,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName,
          getLocalIdent
        }
      },
      'less-loader'
    ]
  },
  {
    test: /\.(css|less)$/i,
    use: ['style-loader', 'css-loader', 'less-loader']
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
    test: /\.md$/,
    use: [
      {
        loader: 'html-loader'
      },
      {
        loader: 'markdown-loader',
        options: {
          /* your options here */
        }
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
    test: /\.woff?$/,
    use: [
      {
        loader: 'url-loader?limit=3000&mimetype=application/font-woff'
      }
    ]
  },
  {
    test: /\.mdx$/i,
    use: [
      {
        loader: 'babel-loader'
      },
      {
        loader: '@mdx-js/loader',
        options: {
          compilers: [createCompiler({})]
        }
      }
    ]
  },
  {
    // For the code view in the CSF (component story format)
    // Only apply to stories. See https://github.com/storybookjs/storybook/pull/8773 for context
    test: /\.story\.js$/,
    loader: require.resolve('@storybook/source-loader'),
    exclude: [/node_modules/],
    enforce: 'pre'
  }
];

module.exports = async ({ config }) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: 'false',
      __HOT_RELOAD__: 'false'
    })
  );
  config.module.rules = necessaryLoaders;
  config.plugins.push(cssIdentWebpackPlugin);
  config.watchOptions = {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 2000
  };
  return config;
};
