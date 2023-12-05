/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-env node */

const { buildParserFile } = require('@lezer/generator');

module.exports = function lezerLoader(source, opts = {}) {
  const built = buildParserFile(source, {
    exportName: 'parser',
    ...opts
  });
  return built.parser;
};
