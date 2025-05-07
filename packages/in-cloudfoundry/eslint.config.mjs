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
        'in-cloudfoundry',

        // unwanted dependencies, that will need refactoring
        'in-applications',

        // shared packages
        'in-components',
        'in-forge',
        'in-hoc',
        'in-services',
        'in-stores',
        'in-subscription'
        //'in-test'
      ]
    })
  }
};
