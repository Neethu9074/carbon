/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  plugins: ['react', 'import'],
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,

      allowedInPackages: ['in-visualize', 'in-infrastructure']
    }),
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function'
      }
    ],
    'react/no-multi-comp': ['error', { ignoreStateless: true }],
    'import/prefer-default-export': ['error', { target: 'single' }]
  }
};
