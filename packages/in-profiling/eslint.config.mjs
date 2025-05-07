/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,

      allowedInPackages: [
        // current package
        'in-profiling',

        // dependency on another team/area
        'in-analyze',
        'in-infrastructure',

        // shared package
        'in-components',
        'in-hoc',
        'in-hooks',
        'in-forge',
        'in-sdk',
        'in-services',
        'in-stores',
        'in-subscription'
      ]
    })
  }
};
