/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
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
          'in-applications',
          'in-components',
          'in-custom-dashboards',
          'in-hooks',
          'in-service-levels',
          'in-services',
          'in-stores',
          'in-subscription',
          'in-synthetics',
          'in-themes',
          'in-bizops',
          'in-websites',
          'in-mobile-apps',
          'in-settings',
          'in-plg'
        ]
      })
    }
  }
];
