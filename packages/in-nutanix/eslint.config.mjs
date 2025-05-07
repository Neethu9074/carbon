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
        'in-nutanix',

        // shared package
        'in-components',
        'in-forge',
        'in-hoc',
        'in-i18n',
        'in-stores',
        'ui-client',
        'in-services',
        'in-hooks',
        'in-infrastructure',
        'in-sdk',
        'in-subscription'
      ]
    })
  }
};
