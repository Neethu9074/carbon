/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

module.exports = {
  /* usually "stories" are defined here, but we do some
    adaption, and configure that in preview.js
   */
  core: {
    builder: 'webpack5'
  },
  addons: ['@storybook/addon-essentials'],
  features: {
    emotionAlias: false
  }
};
