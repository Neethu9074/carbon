/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  webpackPlugin: cssIdentWebpackPlugin,
  localIdentName,
  getLocalIdent
} = require('./build/webpack/cssIdentifiers');
const { isDevModeBuild, hasDetailedSourceMaps } = require('./build/webpack/opts');
const forkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { resolveToEsbuildTarget } = require('esbuild-plugin-browserslist');
const browserslist = require('browserslist');
const hotReload = isDevModeBuild && !!process.env.HOT_RELOAD;

// to disable esbuild the developer needs to explicitly set this ENV to false
// USE_ESBUILD=false
// in any other cases, esbuild will be activated
const use_esbuild = !(process.env.USE_ESBUILD === 'false');
const esBuildTargets = resolveToEsbuildTarget(browserslist(), {
  printUnknownTargets: false
});

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(isDevModeBuild ? 'true' : 'false')),
  __HOT_RELOAD__: JSON.stringify(JSON.parse(hotReload ? 'true' : 'false')),

  // this is necessary for the React and Invariant modules
  'process.env.NODE_ENV': isDevModeBuild ? '"development"' : '"production"',

  // This is necessary for SvgIcons rendering properly, as it contains a
  // check of this env variable:
  // see https://github.ibm.com/instana/ui-foundation/blob/main/packages/components/src/components/SvgIcon/SvgIcon.tsx
  // It will be removed after carbon migration of icons is done.
  'process.env.STORYBOOK': 'false',

  'process.env.IS_TEST': 'false'
});

const gitCommitIdPrefix = process.env.GIT_SHORT_COMMIT ?? '';

const plugins = [
  new WebpackBar(),
  definePlugin,
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^$/),
  new CaseSensitivePathsPlugin(),
  cssIdentWebpackPlugin,
  process.env.ANALYZE_BUNDLE && new BundleAnalyzerPlugin(),
  new MiniCssExtractPlugin({
    filename: 'compStyle.css',
    chunkFilename: gitCommitIdPrefix + '-[id]-chunks.css',
    ignoreOrder: true
  }),
  isDevModeBuild &&
    new forkTsCheckerWebpackPlugin({
      async: true,
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        },
        mode: 'write-references',
        memoryLimit: 4096
      }
    })
].filter(Boolean);

const entry = hotReload
  ? {
      // the 'webpack/hot/only-dev-server' part prevents reload on syntax errors
      index: ['./packages/in-client/js/index.js', 'webpack/hot/only-dev-server'],
      waiting: ['./packages/in-waiting-for-deployment/index.js', 'webpack/hot/only-dev-server'], // WebpackDevServer host and port
      devServerClient: 'webpack-dev-server/client?https://local-instana.instana.io:4000'
    }
  : {
      index: './packages/in-client/js/index.js',
      waiting: './packages/in-waiting-for-deployment/index.js'
    };

const styleLoader = {
  loader: MiniCssExtractPlugin.loader
};

const lessLoader = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      sourceMap: isDevModeBuild
    }
  }
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: isDevModeBuild,
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
    },
    sourceMap: isDevModeBuild
  }
};

const simpleCssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: isDevModeBuild
  }
};

const determineDevTool = () => {
  if (isDevModeBuild && hasDetailedSourceMaps) {
    return 'eval-source-map';
  }
  if (isDevModeBuild) {
    return 'eval';
  }
  return 'source-map';
};

const infrastructureLogging = isDevModeBuild ? { level: 'warn' } : undefined;

const webpackFontsRules = [
  {
    test: /\.(ttf|eot|obj)$/i,
    type: 'asset/resource'
  },
  {
    test: /\.woff?$/,
    type: 'asset/resource'
  }
];

const webpackStyleRules = [
  {
    test: /\.mless$/i,
    use: [styleLoader, cssLoader, postCssLoader, lessLoader]
  },
  {
    test: /\.less$/i,
    use: [styleLoader, simpleCssLoader, postCssLoader, lessLoader]
  },
  {
    test: /\.css$/i,
    use: [styleLoader, simpleCssLoader, postCssLoader]
  }
];

const webpackImageRule = {
  test: /\.(jpe?g|gif|png|svg)$/i,
  type: 'asset/resource'
};

const webpackShaderRule = {
  test: /\.glsl$/i,
  use: [
    {
      loader: 'raw-loader'
    }
  ]
};

const webpackSourcesRule = {
  test: /\.(js|ts|tsx)$/i,
  exclude: {
    // Explicitly enable transpilation of @instana/types, because it purely consists of automatically generated typescript
    // code that can't easily be transpiled upon creation
    and: [/node_modules/, { not: [path.resolve(__dirname, 'node_modules', '@instana', 'types')] }]
  },
  use: [
    use_esbuild
      ? {
          options: {
            loader: 'tsx',
            target: [...esBuildTargets]
          },
          loader: 'esbuild-loader'
        }
      : {
          options: { cacheDirectory: true },
          loader: 'babel-loader'
        }
  ]
};

const webpackYamlRule = {
  test: /\.yaml$/i,
  use: [
    {
      loader: 'raw-loader'
    }
  ]
};

const webpackMarkdownRule = {
  test: /\.md$/,
  use: [
    {
      loader: 'html-loader!markdown-loader'
    }
  ]
};

const lezerGrammarRule = {
  test: /\.grammar$/,
  use: {
    loader: path.resolve(__dirname, 'build', 'webpack', 'lezer-loader.js')
  }
};

const cache = isDevModeBuild && {
  type: 'filesystem'
};

module.exports = {
  cache,
  entry,
  mode: process.env.NODE_ENV,
  context: __dirname,
  output: {
    path: path.join(__dirname, 'target/assets/bundle/'),
    publicPath: 'auto',
    chunkFilename: '[name].[contenthash].js'
  },
  devtool: determineDevTool(),
  infrastructureLogging,
  module: {
    rules: [
      ...webpackFontsRules,
      ...webpackStyleRules,
      webpackImageRule,
      webpackShaderRule,
      webpackSourcesRule,
      webpackYamlRule,
      webpackMarkdownRule,
      lezerGrammarRule
    ]
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.d.ts'],
    alias: { 
      'react-dom/client': false, // Mock out the module
      react$: require.resolve('react'),
      ['react-dom']: require.resolve('react-dom')
    }
  }
};
