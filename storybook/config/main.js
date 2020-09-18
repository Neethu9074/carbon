/* eslint-env node */
/* eslint-disable no-unused-vars */

const path = require('path');
const custom = require('./webpack.config.js');

module.exports = {
  stories: ['../src/**/*.story.@(js|md)'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-actions', '@storybook/addon-docs'],
  webpackFinal: config => {
    return { ...config, module: { ...config.module, rules: custom.rules } };
  }
};
