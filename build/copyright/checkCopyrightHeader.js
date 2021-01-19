#!/usr/bin/env node
/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-console */

const getFilesWithoutcopyright = require('./util.js');

const path = require('path');

async function checkFiles(fileType) {
  const files = await getFilesWithoutcopyright(fileType);
  if (files.length > 0) {
    console.log(`The following files do not contain a copyright header.\n\n${files.map(extractPath).join('\n')}\n\n`);
    process.exit(1);
  }
}

function extractPath(file) {
  return path.relative(path.join(__dirname, '..'), file.path);
}

(async () => {
  checkFiles('.js');
  checkFiles('.less');
  checkFiles('.mless');
  checkFiles('.glsl');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
