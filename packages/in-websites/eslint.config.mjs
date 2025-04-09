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

        patterns: [
          // this section contains public exports like public paths, routes, etc.
          '!in-mobile-apps/navigation'
        ],

        allowedInPackages: [
          // current package
          'in-websites',

          // shared packages
          'in-components',
          'in-hoc',
          'in-hooks',
          'in-service-levels',
          'in-services',
          'in-stores',
          'in-subscription',
          'in-test',
          'in-themes',

          // unwanted dependencies, that will need refactoring
          'in-alerting',
          'in-applications',
          'in-custom-dashboards',
          'in-settings',

          'in-analyze',
          'in-map',
          'in-synthetics'
        ]
      })
    }
  }
];
