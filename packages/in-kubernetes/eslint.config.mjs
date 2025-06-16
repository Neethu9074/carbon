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
          'in-kubernetes',

          // cross-team dependencies
          'in-infrastructure',
          'in-applications',
          'in-automation',
          'in-logging',
          'in-analyze',

          // shared packages
          'in-custom-dashboards',
          'in-integrations',
          'in-map',
          'in-test',
          'in-forge',
          'in-hooks',
          'in-hoc',
          'in-sdk',
          'in-themes',
          'in-components',
          'in-services',
          'in-settings',
          'in-subscription',
          'in-stores'
        ]
      })
    }
  }
];
