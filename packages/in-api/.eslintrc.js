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
        'in-api',

        // unwanted dependencies, that will need refactoring
        'in-alerting',
        'in-applications',
        'in-components',
        'in-settings',

        // shared packages
        'in-services',
        'in-test'
      ]
    })
  }
};
