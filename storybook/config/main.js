/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */
const path = require('path'); // Import the path module

module.exports = {
  stories: [
    {
      directory: '../../storybook',
      titlePrefix: 'Getting Started',
      files: '*.stories.mdx'
    },
    '../../packages/**/*.(story|stories).@(js|jsx|ts|tsx|mdx)'
  ],
  staticDirs: ['../public'],
  core: {
    disableTelemetry: true,
    builder: 'webpack5',
    options: {
      lazyCompilation: true,
      fsCache: true
    }
  },
  refs: {
    'design-system2': {
      title: 'Instana Design System test',
      url: 'http://localhost:6006/foundation-ui-build/'
    }
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: { fastRefresh: true }
  },
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-docs'],
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin'
  },
  webpackFinal(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom')
    };
    return config;
  }
};
