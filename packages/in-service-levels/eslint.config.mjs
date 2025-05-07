/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  plugins: ['react', 'import'],
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
};
