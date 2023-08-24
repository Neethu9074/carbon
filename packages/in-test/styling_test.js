/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node, jest */

const { expect } = require('chai');
const path = require('node:path');
const fs = require('node:fs/promises');
const glob = require('glob');

describe('CSS modules', () => {
  it(
    'must define :local wrapper inside *.mless files',
    async () => {
      const pat = `${__dirname}/../**/*.mless`;
      const filesWithContent = await Promise.all(glob.sync(pat).map(getContent));
      const filesWithoutLocalWrapper = filesWithContent.filter(f => !isDefiningLocalWrapper(f));

      const msg =
        `The following files do not contain a :local {…} wrapper. This must be defined in order to ` +
        `avoid CSS class name clashes.\n\n${filesWithoutLocalWrapper.map(extractPath).join('\n')}\n\n`;
      expect(filesWithoutLocalWrapper).to.have.lengthOf(0, msg);
    },
    30 * 1000
  );

  it(
    'must not define :local wrapper inside *.less files',
    async () => {
      const pat = `${__dirname}/../**/*.less`;
      const filesWithContent = await Promise.all(glob.sync(pat).map(getContent));
      const filesWithLocalWrapper = filesWithContent.filter(f => isDefiningLocalWrapper(f));

      const msg =
        `The following files contain a :local {…} wrapper. The file name extension must be .mless.` +
        `Please rename the files to mless.\n\n${filesWithLocalWrapper.map(extractPath).join('\n')}\n\n`;
      expect(filesWithLocalWrapper).to.have.lengthOf(0, msg);
    },
    30 * 1000
  );
});

function getContent(path) {
  return fs.readFile(path, { encoding: 'utf8' }).then(content => ({
    content,
    path
  }));
}

function isDefiningLocalWrapper(file) {
  return file.content.indexOf(':local {') >= 0;
}

function extractPath(file) {
  return path.relative(`${__dirname}/..`, file.path);
}
