#!/usr/bin/env node
/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */
/* eslint-disable no-console */

const Parser = require('i18next-scanner').Parser;
const get = require('lodash').get;
const path = require('path');
const glob = require('glob');

const fs = require('fs');

const DEFAULT_NAMESPACE = 'in-i18n';

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
  if (!languageFile || !get(languageFile, propPath.split('.'))) {
    findings.push(i18nKey);
  }
}

if (findings.length > 0) {
  console.error(
    `The following keys don't have an entry inside the corresponding language file:\n ${findings.join(',\n')}`
  );
  process.exit(1);
}

function getAllI18nKeys() {
  const parser = new Parser({});
  const keys = new Set();

  const files = getAllFiles('*.js');
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    parser.parseFuncFromString(content, { list: ['t'] }, key => keys.add(key));
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
    languagesMap.set(namespace, JSON.parse(content));
  }
  return languagesMap;
}

function getAllFiles(filePattern) {
  return glob.sync(`${__dirname}/../../packages/**/${filePattern}`, {
    ignore: ['**/node_modules/**']
  });
}
