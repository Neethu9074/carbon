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
        'in-stores',
        'in-subscription',
        'in-api',
        // FIXME This import rule might be indicative of circular imports.
        'in-services',
        // FIXME This import rule might be indicative of circular imports.
        'in-components',
        // FIXME This import rule might be indicative of circular imports.
        'in-hooks',
        // FIXME This import path should not exist in a global package
        'in-events'
      ]
    })
  }
};
