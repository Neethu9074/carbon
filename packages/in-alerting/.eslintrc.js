/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('../../build/linting/restrictedImportRule');

module.exports = {
  rules: {
    ...createImportRestrictionRule({
      enforceAbsoluteImportPaths: true,

      patterns: [
        '!in-synthetics/navigation'
      ],

      allowedInPackages: [
        'in-alerting',
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
        'in-websites'
      ]
    })
  }
};
