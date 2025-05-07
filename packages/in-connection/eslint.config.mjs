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
        'in-connection',
        'in-api',
        'in-types',
        // FIXME This import rule might be indicative of circular imports.
        'in-services',
        // FIXME This import rule might be indicative of circular imports.
        'in-components',
        // FIXME This import rule might be indicative of circular imports.
        'in-subscription'
      ]
    })
  }
};
