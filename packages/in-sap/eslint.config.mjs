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
        'in-sap',

        // shared package
        'in-components',
        'in-forge',
        'in-hoc',
        'in-hooks',
        'in-infrastructure',
        'in-kubernetes',
        'in-sdk',
        'in-services',
        'in-stores',
        'in-subscription'
      ]
    })
  }
};
