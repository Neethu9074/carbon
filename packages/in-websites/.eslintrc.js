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

      patterns: [
        // this section contains public exports like public paths, routes, etc.
        '!in-mobile-apps/navigation'
      ],

      allowedInPackages: [
        // current package
        'in-websites',

        // shared packages
        'in-components',
        'in-hoc',
        'in-hooks',
        'in-services',
        'in-stores',
        'in-subscription',
        'in-test',
        'in-themes',

        // unwanted dependencies, that will need refactoring
        'in-alerting',
        'in-applications',
        'in-settings',

        'in-analyze',
        'in-map',
        'in-synthetics'
      ]
    })
  }
};
