/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-disable no-restricted-imports */
import { createImportRestrictionRule } from '../../build/linting/restrictedImportRule.js';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    rules: {
      ...createImportRestrictionRule({
        enforceAbsoluteImportPaths: true,

        allowedInPackages: [
          // current package
          'in-integrations',

          // unwanted dependencies, that will need refactoring
          'in-settings',

          // shared packages
          'in-components',
          'in-services',
          'in-hooks',
          'in-hoc',
          'in-stores',
          'in-subscription',
          'in-logging'
        ]
      })
    }
  }
];
