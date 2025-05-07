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
      paths: ['in-types', '@instana/i18n-react'],
      allowedInPackages: [
        // current package
        'in-infrastructure',

        // cross-team dependencies
        'in-kubernetes',
        'in-alerting',
        'in-analyze',
        'in-plg',

        // shared packages
        'in-custom-dashboards',
        'in-waiting-for-deployment',
        'in-integrations',
        'in-map',
        'in-internal',
        'in-test',
        'in-api',
        'in-forge',
        'in-hooks',
        'in-hoc',
        'in-sdk',
        'in-themes',
        'in-components',
        'in-services',
        'in-settings',
        'in-subscription',
        'in-stores'
      ]
    })
  }
};
