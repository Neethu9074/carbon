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
    rules: {
      ...createImportRestrictionRule({
        enforceAbsoluteImportPaths: true,

        patterns: [
          '!in-mobile-apps/subscriptions',
          '!in-mobile-apps/api',
          '!in-synthetics/api',
          '!in-synthetics/dashboards',
          '!in-synthetics/navigation',
          '!in-synthetics/subscriptions',
          '!in-synthetics/tags',
          '!in-synthetics/utils',
          '!in-websites/navigation'
        ],

        allowedInPackages: [
          'in-alerting',

          // other areas
          'in-analyze',
          'in-applications',
          'in-events',
          'in-custom-dashboards',
          'in-infrastructure',
          'in-logging',
          'in-mobile-apps',
          'in-service-levels',
          'in-websites',

          // shared
          'in-api',
          'in-components',
          'in-hoc',
          'in-hooks',
          'in-sdk',
          'in-services',
          'in-settings',
          'in-stores',
          'in-subscription',
          'in-test',
          'in-themes'
        ]
      })
    }
  }
];
