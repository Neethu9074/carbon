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
          'in-i18n',
          'in-test',
          // FIXME This import rule might be indicative of circular imports.
          'in-services',
          // FIXME This import rule might be indicative of circular imports.
          'in-components'
        ]
      })
    }
  }
];
