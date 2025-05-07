/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    'no-console': 0,
    'new-cap': 0,
    strict: 0,
    ...createImportRestrictionRule({
      allowedInPackages: []
    })
  }
};
