/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-disable no-restricted-imports */
import { createImportRestrictionRule } from '../../build/linting/restrictedImportRule.js';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: [
      'node_modules',
      '.yarn'
    ]
  },
  {
    rules: {
      'no-console': 0,
      'new-cap': 0,
      strict: 0,
      ...createImportRestrictionRule({
        allowedInPackages: []
      })
    }
  }
];
