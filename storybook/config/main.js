/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

module.exports = {
  stories: [
    {
      directory: '../../storybook',
      titlePrefix: 'Getting Started',
      files: '*.stories.mdx'
    },
    '../../packages/**/*.(story|stories).@(js|jsx|ts|tsx|mdx)'
  ],
  core: {
    disableTelemetry: true,
    builder: 'webpack5',
    options: {
      lazyCompilation: true,
      fsCache: true
    }
  },
  refs: {
    'design-system': {
      title: 'Instana Design System',
      url: 'https://pages.github.ibm.com/instana/ui-foundation/'
    }
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: { fastRefresh: true }
  },
  addons: ['@storybook/addon-essentials'],
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin'
  },
  features: {
    storyStoreV7: false
  }
};
