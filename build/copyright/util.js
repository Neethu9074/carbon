/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

const { containsCopyrightHeader } = require('./copyrightHeader.js');
const Promise = require('bluebird');
const fs = require('fs');

const glob = Promise.promisify(require('glob'));
Promise.promisifyAll(fs);

module.exports = function getFilesWithoutCopyright(fileType) {
  return glob(`${__dirname}/../../packages/**/*${fileType}`, {
    ignore: ['**/node_modules/**']
  })
    .then(files => files.filter(isNotIgnored))
    .then(getFiles)
    .then(files => files.filter(doesNotHavecopyrightHeader));
};

async function getFiles(files) {
  const readFiles = [];
  const bunchSize = 100;
  for (let i = 0; i < files.length; i += bunchSize) {
    const slice = files.slice(i, i + bunchSize);
    const r = await Promise.all(slice.map(getContent));
    for (let i2 = 0; i2 < r.length; i2++) {
      readFiles.push(r[i2]);
    }
  }

  return readFiles;
}

function isNotIgnored(_path) {
  return _path.indexOf('in-themes/active.less') === -1;
}

function getContent(_path) {
  return fs.readFileAsync(_path, { encoding: 'utf8' }).then(content => ({
    content,
    path: _path
  }));
}

function doesNotHavecopyrightHeader(file) {
  return !containsCopyrightHeader(file.content);
}
