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
        'in-phmc',

        // dependency on another team/area
        'in-infrastructure',

        // shared package
        'in-components',
        'in-forge',
        'in-hoc',
        'in-i18n',
        'in-stores',
        'ui-client',
        'in-services',
        'in-hooks',
        'in-sdk',
        'in-subscription'
      ]
    })
  }
};
