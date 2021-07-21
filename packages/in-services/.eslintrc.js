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
      allowedInPackages: [
        'in-services',
        'in-i18n',
        'in-types',
        'in-connection',

        // FIXME This import path should not exist
        'in-map',
        // FIXME This import path should not exist
        'in-settings',
        // FIXME This import path might be circular loop.
        'in-api',

        // FIXME Circular import
        'in-subscription',
        // FIXME This is a circular import.
        'in-components',
        // FIXME This is a circular import.
        'in-stores'
      ]
    })
  }
};
