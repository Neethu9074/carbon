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
      files: '*.mdx'
    },
    '../../packages/**/*.@(mdx)',
    '../../packages/**/*.(story|stories).@(js|jsx|ts|tsx)'
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
    'design-system-dev': {
      title: 'Instana Design System dev',
      url: './ui-foundation/build'
    }
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: { fastRefresh: true }
  },
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-docs', '@storybook/addon-a11y'],
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
