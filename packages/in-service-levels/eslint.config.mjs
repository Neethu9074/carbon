/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-disable no-restricted-imports */
import imports from 'eslint-plugin-import';

import { createImportRestrictionRule } from '../../build/linting/restrictedImportRule.js';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    plugins: {
      import: imports
    },
    rules: {
      ...createImportRestrictionRule({
        enforceAbsoluteImportPaths: true,

        allowedInPackages: [
          'in-alerting',
          'in-analyze',
          'in-api',
          'in-applications',
          'in-components',
          'in-hooks',
          'in-service-levels',
          'in-services',
          'in-stores',
          'in-subscription',
          'in-synthetics',
          'in-test',
          'in-themes',
          'in-websites'
        ]
      }),
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function'
        }
      ],
      'react/no-multi-comp': ['error', { ignoreStateless: true }],
      'no-duplicate-imports': 'error'
    }
  }
];
