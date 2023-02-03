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
      files: '*.story.mdx'
    },
    '../../packages/**/*.story.@(js|jsx|ts|tsx|mdx)'
  ],
  core: {
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
  framework: '@storybook/react',
  addons: ['@storybook/addon-essentials'],
  features: {
    emotionAlias: false
  }
};
