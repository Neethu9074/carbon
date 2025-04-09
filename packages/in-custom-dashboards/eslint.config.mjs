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

        allowedInPackages: [
          // current package
          'in-custom-dashboards',

          // unwanted dependencies, that will need refactoring
          'in-alerting',
          'in-analyze',
          'in-applications',
          'in-bizops',
          'in-cockpit',
          'in-events',
          'in-infrastructure',
          'in-logging',
          'in-mobile-apps',
          'in-plg',
          'in-service-levels',
          'in-synthetics',
          'in-websites',

          // shared packages
          'in-api',
          'in-components',
          'in-client',
          'in-services',
          'in-test',

          'in-forge',
          'in-hooks',
          'in-hoc', // only 'in-hoc/connectTo'
          'in-stores',
          'in-sdk',
          'in-subscription',
          'in-themes'
        ]
      })
    }
  }
];
