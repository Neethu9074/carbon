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
          'in-events',

          // shared package
          'in-components',
          'in-api',
          'in-stores',
          'in-services',
          'in-hooks',
          'in-subscription',
          'in-waiting-for-deployment',
          'in-hoc',
          'in-themes',

          // cross-team dependencies
          'in-alerting',
          'in-cockpit',
          'in-applications',
          'in-automation',
          'in-custom-dashboards',
          'in-infrastructure',
          'in-logging',
          'in-mobile-apps',
          'in-plg',
          'in-service-levels',
          'in-synthetics',
          'in-websites',
          'in-eum',
          'in-settings',
          'in-internal',
          'in-forge',
          'in-analyze',
          'in-sdk',
          'in-kubernetes',
          'in-bizops'
        ]
      })
    }
  }
];
