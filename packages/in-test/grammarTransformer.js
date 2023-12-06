/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

const lezerLoader = require('../../build/webpack/lezer-loader');

module.exports = {
  process(sourceText) {
    return {
      code: lezerLoader(sourceText, { moduleStyle: 'cjs' })
    };
  }
};
