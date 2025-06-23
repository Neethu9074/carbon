/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
          'in-alerting',
          'in-analyze',
          'in-api',
          'in-applications',
          'in-automation',
          'in-components',
          'in-infrastructure',
          'in-events',
          'in-hoc',
          'in-hooks',
          'in-logging',
          'in-mobile-apps',
          'in-sdk',
          'in-services',
          'in-service-levels',
          'in-settings',
          'in-stores',
          'in-subscription',
          'in-synthetics',
          'in-forge',
          'in-websites'
        ]
      }),
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function'
        }
      ]
    }
  }
];
