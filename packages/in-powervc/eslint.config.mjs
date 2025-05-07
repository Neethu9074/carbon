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
        'in-powervc',

        // dependency on another team/area
        'in-infrastructure',
        'in-openstack',

        // shared package
        'in-components',
        'in-hoc',
        'in-stores',
        'in-forge',
        'in-sdk',
        'in-services',
        'in-subscription'
      ]
    })
  }
};
