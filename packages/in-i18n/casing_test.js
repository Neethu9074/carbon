/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
/* eslint-env mocha, node */

import fs from 'fs/promises';
import { expect } from 'chai';
import glob from 'glob';
import path from 'path';

// i18n contexts are currently not supported. Let's revisit this once we have a context use case.
const forbiddenCharacters = /^[a-zA-Z0-9]+(_(plural|\d+))?$/;

const i18nFiles = glob.sync('*/i18n/*.json', {
  cwd: path.join(__dirname, '..'),
  dot: false
});

i18nFiles.forEach(filePath =>
  describe(filePath, () => {
    it('must not use forbidden characters in keys', async () => {
      const content = await fs.readFile(path.join(__dirname, '..', filePath), { encoding: 'utf8' });
      const translations = JSON.parse(content);
      validateKeys(translations, key => {
        expect(key).to.match(forbiddenCharacters);
      });
    });
  })
);

function validateKeys(obj, validator) {
  Object.keys(obj).forEach(key => {
    validator(key);

    const value = obj[key];
    if (Object.getPrototypeOf(value) === Object.prototype) {
      validateKeys(value, validator);
    }
  });
}
