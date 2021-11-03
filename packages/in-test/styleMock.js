/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

// We need to manually re-create the commonJS/ESM compatibility structure,
// because usage of Jest's moduleNameMapper API does not auto-create this.
module.exports = {
  __esModule: true,
  default: new Proxy(
    {},
    {
      get(target, prop) {
        return `local-css-${prop}`;
      }
    }
  )
};
