/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,

      allowedInPackages: [
        'in-analyze',
        'in-api',
        'in-applications',
        'in-components',
        'in-hooks',
        'in-services',
        'in-stores',
        'in-subscription',
        'in-test',
        'in-themes',
        'in-websites',
        'in-service-levels'
      ]
    })
  }
};
