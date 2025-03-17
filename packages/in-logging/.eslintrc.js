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

        // other teams:
        'in-alerting',
        'in-analyze',
        'in-applications',
        'in-custom-dashboards',
        'in-integrations',

        // shared packages
        'in-components',
        'in-hooks',
        'in-sdk',
        'in-services',
        'in-settings',
        'in-stores',
        'in-subscription',
        'in-themes'
      ]
    })
  }
};
