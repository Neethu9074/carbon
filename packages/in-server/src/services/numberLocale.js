/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
'use strict';

const path = require('path');
const fs = require('fs');

const formatLocaleDir = path.join(__dirname, '..', '..', 'node_modules', 'd3-format', 'locale');
const supportedNumberLocales = fs.readdirSync(formatLocaleDir).reduce((agg, fileName) => {
  const fileContent = fs.readFileSync(path.join(formatLocaleDir, fileName), { encoding: 'utf8' });
  // stringify/parse to get rid of all extra whitespace
  const localeDefinition = JSON.stringify(JSON.parse(fileContent));
  agg[fileName.toLowerCase().replace('.json', '')] = localeDefinition;
  return agg;
}, {});

module.exports = exports = function getNumberLocaleDefinition(request) {
  const lang = request.acceptsLanguages(Object.keys(supportedNumberLocales));
  if (!lang) {
    return false;
  }

  const definition = supportedNumberLocales[lang.toLowerCase()];
  if (!definition) {
    return false;
  }

  return definition;
};
