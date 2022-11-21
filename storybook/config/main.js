/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

module.exports = {
  stories: ['../../packages/**/*.story.@(js|jsx|ts|tsx|mdx)'],
  core: {
    builder: 'webpack5'
  },
  addons: ['@storybook/addon-essentials'],
  features: {
    emotionAlias: false
  }
};
