/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
          'in-amp',
          'in-api',
          'in-applications',
          'in-automation',
          'in-bizops',
          'in-components',
          'in-connection',
          'in-events',
          'in-forge',
          'in-hooks',
          'in-hoc',
          'in-integrations',
          'in-kubernetes',
          'in-logging',
          'in-mobile-apps',
          'in-sdk',
          'in-settings',
          'in-services',
          'in-stores',
          'in-subscription',
          'in-synthetics',
          'in-websites',
          'in-infrastructure',
          'in-service-levels',
          'in-analyze'
        ]
      })
    }
  }
];
