#!/usr/bin/env node
/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-console */

const Promise = require('bluebird');
const fs = require('fs');

const { copyrightHeader } = require('./copyrightHeader.js');
const getFilesWithoutcopyright = require('./util.js');

const writeFile_promise = Promise.promisify(fs.writeFile);

async function addCopyrightHeader(fileType) {
  const files = await getFilesWithoutcopyright(fileType);
  return Promise.all(files.map(addcopyrightHeaderToFile));
}

function addcopyrightHeaderToFile({ path, content }) {
  return writeFile_promise(path, copyrightHeader + content, function(err) {
    if (err) {
      return console.log('Error adding copyright header to file:' + path, err);
    }
  });
}

(async () => {
  addCopyrightHeader('.less');
  addCopyrightHeader('.mless');
  addCopyrightHeader('.js');
  addCopyrightHeader('.glsl');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
