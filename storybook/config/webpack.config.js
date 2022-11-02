/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

const webpack = require('webpack');
const path = require('path');
const {
  webpackPlugin: cssIdentWebpackPlugin,
  localIdentName,
  getLocalIdent
} = require('../../build/webpack/cssIdentifiers');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const styleLoader = {
  loader: 'style-loader',
  options: { injectType: 'singletonStyleTag' }
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    postcssOptions: {
      plugins: [
        require('postcss-discard-comments')({
          removeAll: true
        }),
        require('autoprefixer')()
      ]
    }
  }
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName,
      getLocalIdent
    }
  }
};

// This is a modified set of loaders. It specifically excludes some special cases around CSS extraction
// and CSS names.
const necessaryLoaders = [
  {
    test: /\.(ttf|eot|obj)$/i,
    type: 'asset/resource'
  },
  {
    test: /\.mless$/i,
    use: [styleLoader, cssLoader, postCssLoader, 'less-loader']
  },
  {
    test: /\.less$/i,
    use: ['style-loader', 'css-loader', 'less-loader']
  },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.(jpe?g|gif|png|svg)$/i,
    type: 'asset/resource'
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
    test: /\.(js|ts|tsx)$/i,
    exclude: {
      // Explicitly enable transpilation of @instana/types, because it purely consists of automatically generated typescript
      // code that can't easily be transpiled upon creation
      and: [/node_modules/, { not: [path.resolve(__dirname, '..', '..', 'node_modules', '@instana', 'types')] }]
    },
    use: [
      {
        options: { cacheDirectory: true },
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
  },
  {
    test: /\.mdx$/i,
    use: [
      {
        loader: 'babel-loader'
      },
      {
        // Issue: Referencing `@mdx-js/loader` (as a string) here would cause
        // problems, because the Node root resolve dir for dependencies is technically
        // the root ui-client dir. Referencing the dependency relative to this file
        // provides an escape hatch.
        loader: path.join(__dirname, '..', 'node_modules', '@mdx-js', 'loader'),
        options: { compilers: [createCompiler({})] }
      }
    ]
  },
  {
    // For the code view in the CSF (component story format)
    // Only apply to stories. See https://github.com/storybookjs/storybook/pull/8773 for context
    test: /\.story\.(js|ts|tsx)$/,
    loader: require.resolve('@storybook/source-loader'),
    exclude: [/node_modules/],
    enforce: 'pre'
  }
];

module.exports = async ({ config }) => {
  const defs = {
    // this is necessary for the React and Invariant modules
    __DEV__: 'false',
    __HOT_RELOAD__: 'false'
  };
  config.plugins.push(new webpack.DefinePlugin(defs));
  config.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^$/));
  config.plugins.push(new CaseSensitivePathsPlugin());
  config.plugins.push(cssIdentWebpackPlugin);

  config.module.rules = necessaryLoaders;

  config.resolve.extensions.push('.ts', '.tsx', '.d.ts');
  config.resolve.modules.push(path.join(__dirname, '..', 'node_modules'));

  return config;
};
