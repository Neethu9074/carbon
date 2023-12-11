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
      /*
       * Disabling the restriction, because this is the only place where
       * we currently enable the use of @carbon/colors, because
       * they are used in the chart color definitions
       */
      patterns: ['!@carbon/colors']
    })
  }
};
