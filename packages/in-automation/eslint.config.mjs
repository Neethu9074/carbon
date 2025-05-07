/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
        'in-automation',
        'in-components',
        'in-events',
        'in-hoc',
        'in-hooks',
        'in-logging',
        'in-sdk',
        'in-services',
        'in-settings',
        'in-stores',
        'in-subscription',
        'in-forge'
      ]
    }),
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function'
      }
    ]
  }
};
