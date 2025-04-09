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
          'in-openstack',

          // dependency on another team/area
          'in-infrastructure',

          // shared package
          'in-components',
          'in-forge',
          'in-hoc',
          'in-sdk',
          'in-services',
          'in-stores',
          'in-subscription'
        ]
      })
    }
  }
];
