/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,

      allowedInPackages: [
        'in-alerting',
        'in-applications',
        'in-components',
        'in-custom-dashboards',
        'in-hooks',
        'in-services',
        'in-stores',
        'in-subscription',
        'in-synthetics',
        'in-themes',
        'in-bizops',
        'in-websites',
        'in-mobile-apps',
        'in-settings',
        'in-plg'
      ]
    })
  }
};
