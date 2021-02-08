/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env node, mocha */

const Promise = require('bluebird');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');

const glob = Promise.promisify(require('glob'));
Promise.promisifyAll(fs);

describe('CSS modules', () => {
  it('must define :local wrapper inside *.mless files', () => {
    return glob(`${__dirname}/../**/*.mless`)
      .then(files => Promise.all(files.map(getContent)))
      .then(files => files.filter(f => !isDefiningLocalWrapper(f)))
      .then(files => {
        const msg =
          `The following files do not contain a :local {…} wrapper. This must be defined in order to ` +
          `avoid CSS class name clashes.\n\n${files.map(extractPath).join('\n')}\n\n`;
        expect(files).to.have.lengthOf(0, msg);
      });
  });

  it('must not define :local wrapper inside *.less files', () => {
    return glob(`${__dirname}/../**/*.less`)
      .then(files => Promise.all(files.map(getContent)))
      .then(files => files.filter(isDefiningLocalWrapper))
      .then(files => {
        const msg =
          `The following files contain a :local {…} wrapper. The file name extension must be .mless.` +
          `Please rename the files to mless.\n\n${files.map(extractPath).join('\n')}\n\n`;
        expect(files).to.have.lengthOf(0, msg);
      });
  });
});

function getContent(path) {
  return fs.readFileAsync(path, { encoding: 'utf8' }).then(content => ({
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
