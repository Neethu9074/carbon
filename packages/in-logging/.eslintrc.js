/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,
      allowedInPackages: [
        'in-logging',
        'in-analyze',
        'in-api',
        'in-applications',
        'in-components',
        'in-events',
        'in-hoc',
        'in-hooks',
        'in-services',
        'in-settings',
        'in-stores',
        'in-subscription',
        'in-test',
        'in-themes',
        'in-websites',
        'in-custom-dashboards',
        'in-sdk'
      ]
    })
  }
};
