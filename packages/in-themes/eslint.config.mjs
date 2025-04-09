/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createImportRestrictionRule } from '../../build/linting/restrictedImportRule.js';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...createImportRestrictionRule({
        enforceAbsoluteImportPaths: true,
        /*
        * Disabling the restriction, because this is the only place where
        * we currently enable the use of @carbon/colors, because
        * they are used in the chart color definitions
        */
        patterns: ['!@carbon/colors']
      })
    }
  }
];
