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
        'in-bizops',

        // cross-team dependencies
        'in-applications',
        'in-custom-dashboards',
        'in-events',
        'in-kubernetes',
        'in-infrastructure',

        // shared packages
        'in-components',
        'in-api',
        'in-services',
        'in-subscription',
        'in-stores',
        'in-themes',
        'in-hoc',
        'in-hooks',
        'in-test'
      ]
    })
  }
};
