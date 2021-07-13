/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node, jest */

const { Parser } = require('i18next-scanner');
const { difference, get, unset } = require('lodash');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const DEFAULT_NAMESPACE = 'in-i18n';

const transLikeComponentToCheckForKeys = ['Trans', 'TextWithLink'];

// Not using a lambda so that we can adapt the test timeout.
// parseTransFromString takes quite some time
describe('in-i18n/translations', function() {
  jest.setTimeout(1000 * 60);

  const i18nKeys = getAllI18nKeys();

  it('must have a translation for each translation key in en-US', () => {
    const languages = getAllLanguages();
    const findings = [];

    for (let i = 0; i < i18nKeys.length; i++) {
      const i18nKey = i18nKeys[i];

      const { namespace, propPath } = extractNameSpaceAndPropPath(i18nKey);

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

  it('Each translation key in en-US file is being used', () => {
    const namespaceKeysMappingFromI18nKeys = new Map();
    const namespaceKeysMappingFromLanguageFile = new Map();

    const { languagesMap, nestedKeysMap } = getLanguagesAndNestedKeys();

    for (const [namespace, languageFile] of languagesMap.entries()) {
      namespaceKeysMappingFromLanguageFile.set(namespace, languageFileToKeyList(languageFile));
    }

    for (const i18nKey of i18nKeys) {
      const { namespace, propPath } = extractNameSpaceAndPropPath(i18nKey);
      const existingKeysForNameSpace = namespaceKeysMappingFromI18nKeys.get(namespace) || [];

      namespaceKeysMappingFromI18nKeys.set(namespace, [...existingKeysForNameSpace, propPath]);
    }

    const unusedKeyMap = [...namespaceKeysMappingFromLanguageFile].reduce(
      (result, [namespace, keysFromLanguageFile]) => {
        const usedTranslationKeys = namespaceKeysMappingFromI18nKeys.get(namespace) || [];
        const nestedKeys = nestedKeysMap.get(namespace) || [];
        const unusedKey = difference(keysFromLanguageFile, usedTranslationKeys, nestedKeys);

        return unusedKey.length > 0 ? result.set(namespace, unusedKey) : result;
      },
      new Map()
    );

    removeUiFoundationKey(unusedKeyMap);

    if (unusedKeyMap.size > 0) {
      const keysAsString = JSON.stringify(Object.fromEntries(unusedKeyMap), null, 2);

      throw new Error(
        `The following keys from the translation file are not being used in the respective js file(s):\n${keysAsString}`
      );
    }
  });
});

function extractNameSpaceAndPropPath(i18nKey) {
  let namespace = DEFAULT_NAMESPACE;
  let propPath = i18nKey;

  if (i18nKey.includes(':')) {
    const index = i18nKey.match(':').index;

    namespace = i18nKey.slice(0, index);
    propPath = i18nKey.slice(index + 1);
  }

  return { namespace, propPath };
}

function languageFileToKeyList(languageFile) {
  const isObject = val => typeof val === 'object' && !Array.isArray(val);

  const i18KeyList = (languageFile = {}, head = '') => {
    return Object.entries(languageFile).reduce((result, [key, value]) => {
      const fullPath = head ? `${head}.${key}` : key;

      return isObject(value) ? result.concat(i18KeyList(value, fullPath)) : result.concat(fullPath);
    }, []);
  };

  return i18KeyList(languageFile);
}

function getAllI18nKeys() {
  const parser = new Parser({});
  const keys = new Set();

  const files = [...getAllFiles('*.js'), ...getAllFiles('*.ts'), ...getAllFiles('*.tsx')].filter(
    file => !file.includes('_test.')
  );

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });

    parser.parseFuncFromString(content, { list: ['t'] }, key => keys.add(key));
    for (const component of transLikeComponentToCheckForKeys) {
      parser.parseTransFromString(content, { component, i18nKey: 'i18nKey' }, key => keys.add(key));
    }
  }

  return (
    Array.from(keys)
      // Some components work without localization in transition periods. Do not
      // report the empty string as a missing translation.
      .filter(key => key && key !== 'i18nKey')
  );
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

      if (parts.length >= 2) {
        jsonTree[parts[0]] = jsonTree[key];
      }
    } else {
      clearUpContextKeys(value);
    }
  }
}

function getLanguagesAndNestedKeys() {
  const languagesMap = new Map();
  const nestedKeysMap = new Map();
  const files = getAllFiles('en-US.json');

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const pathInsidePackage = path.relative(path.join(__dirname, '..'), filePath);
    const namespace = pathInsidePackage.slice(0, pathInsidePackage.match('/').index);

    const jsonTree = JSON.parse(content);
    ignorePluralsAndContext(jsonTree);

    const nestedKeys = [];
    updateNestedKeyReferences(jsonTree, nestedKeys);

    if (nestedKeys.length) nestedKeysMap.set(namespace, nestedKeys);

    languagesMap.set(namespace, jsonTree);
  }

  return { languagesMap, nestedKeysMap };
}

function updateNestedKeyReferences(jsonTree, nestedKeys) {
  const keys = Object.keys(jsonTree);

  for (const key of keys) {
    const value = jsonTree[key];

    if (typeof value === 'string') {
      const nestedKeyUsage = /\$t\((?<i18nKey>[^,)]+)[,)]/g;

      for (const nestedKey of value.matchAll(nestedKeyUsage)) {
        const {
          groups: { i18nKey }
        } = nestedKey;
        const { propPath } = extractNameSpaceAndPropPath(i18nKey);

        nestedKeys.push(propPath);
      }
    } else {
      updateNestedKeyReferences(value, nestedKeys);
    }
  }
}

function ignorePluralsAndContext(jsonTree) {
  const keys = Object.keys(jsonTree);

  for (const key of keys) {
    const value = jsonTree[key];

    if (typeof value === 'string') {
      const parts = key.split('_');

      if (parts.length >= 2) {
        unset(jsonTree, key);
      }
    } else {
      ignorePluralsAndContext(value);
    }
  }
}

/**
 * ui-foundation i18n keys cannot be found within the ui-client codebase.
 * As such, the translation key usage test would fail. We remove all
 * ui-foundation i18n keys from the map of unused keys to avoid this
 * failure.
 *
 * ui-foundation keys all belong to the default namespace and are located
 * under the components. prefix.
 */
function removeUiFoundationKey(unusedKeysByNamespaceMap) {
  const keys = unusedKeysByNamespaceMap.get('in-i18n');
  const withoutUiFoundationKeys = keys.filter(key => !key.startsWith('components.') && !key.startsWith('formatDate.'));
  unusedKeysByNamespaceMap.set('in-i18n', withoutUiFoundationKeys);
  if (withoutUiFoundationKeys.length === 0) {
    unusedKeysByNamespaceMap.delete('in-i18n');
  }
}
