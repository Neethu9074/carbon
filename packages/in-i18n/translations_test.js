/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node, mocha */

const { Parser } = require('i18next-scanner');
const { get } = require('lodash');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const DEFAULT_NAMESPACE = 'in-i18n';

// Not using a lambda so that we can adapt the test timeout.
// parseTransFromString takes quite some time
describe('in-i18n/translations', function() {
  this.timeout(1000 * 60);

  it('must have a translation for each translation key in en-US', () => {
    const i18nKeys = getAllI18nKeys();
    const languages = getAllLanguages();
    const findings = [];

    for (let i = 0; i < i18nKeys.length; i++) {
      const i18nKey = i18nKeys[i];

      let namespace = DEFAULT_NAMESPACE;
      let propPath = i18nKey;
      if (i18nKey.includes(':')) {
        const index = i18nKey.match(':').index;
        namespace = i18nKey.slice(0, index);
        propPath = i18nKey.slice(index + 1);
      }

      const languageFile = languages.get(namespace);
      if (!languageFile || typeof get(languageFile, propPath.split('.')) !== 'string') {
        findings.push(i18nKey);
      }
    }

    if (findings.length > 0) {
      throw new Error(
        `The following keys don't have an entry inside the corresponding language file:\n${findings.join(',\n')}`
      );
    }
  });
});

function getAllI18nKeys() {
  const parser = new Parser({});
  const keys = new Set();

  const files = getAllFiles('*.js').filter(file => !file.endsWith('_test.js'));
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    parser.parseFuncFromString(content, { list: ['t'] }, key => keys.add(key));
    parser.parseTransFromString(content, key => keys.add(key));
  }

  return Array.from(keys);
}

function getAllLanguages() {
  const languagesMap = new Map();
  const files = getAllFiles('en-US.json');
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const pathInsidePackage = path.relative(path.join(__dirname, '..'), filePath);
    const namespace = pathInsidePackage.slice(0, pathInsidePackage.match('/').index);

    const jsonTree = JSON.parse(content);
    clearUpContextKeys(jsonTree);
    languagesMap.set(namespace, jsonTree);
  }
  return languagesMap;
}

function getAllFiles(filePattern) {
  return glob.sync(`${__dirname}/../../packages/**/${filePattern}`, {
    ignore: ['**/node_modules/**']
  });
}

function clearUpContextKeys(jsonTree) {
  const keys = Object.keys(jsonTree);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = jsonTree[key];
    if (typeof value === 'string') {
      const parts = key.split('_');
      if (parts.length === 2) {
        jsonTree[parts[0]] = jsonTree[key];
      }
    } else {
      clearUpContextKeys(value);
    }
  }
}
