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
    test: /\.mless$/i,
    // use the css, configured for collecting the css ident-names (see above)
    use: [styleLoader, cssLoader, postCssLoader, 'less-loader']
  },
  {
    test: /\.less$/i,
    use: ['style-loader', 'css-loader', 'less-loader']
  },
  {
    // for webgl-shaders
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
        options: {loader: 'tsx'},
        loader: 'esbuild-loader'
      }
    ]
  },
  {
    // yaml files are used on our Welcome pages
    test: /\.yaml$/i,
    use: [
      {
        loader: 'raw-loader'
      }
    ]
  },
  {
    test: /\.grammar$/,
    use: [
      {
        loader: path.resolve(__dirname, '..', '..', 'build', 'webpack', 'lezer-loader.js')
      }
    ]
  }
];

module.exports = async ({ config }) => {
  const defs = {
    // this is necessary for the React and Invariant modules
    // it disables the invariant-checks to avoid throwing exceptions
    __DEV__: 'false',
    __HOT_RELOAD__: 'false'
  };
  config.plugins.push(new webpack.DefinePlugin(defs));
  config.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^$/));
  config.plugins.push(new CaseSensitivePathsPlugin());
  config.plugins.push(cssIdentWebpackPlugin);

  // there are storybook presets which contain all appropriate settings, so we can add just
  // the necessary extra loaders:
  necessaryLoaders.forEach(loader => config.module.rules.push(loader));

  config.resolve.extensions.push('.ts', '.tsx', '.d.ts');
  config.resolve.modules.push(path.join(__dirname, '..', 'node_modules'));

  return config;
};
