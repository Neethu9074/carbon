/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');

exports.getChecksumForFile = function getChecksumForFile(path) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(path))
    .digest('hex')
    .substring(0, 10);
};
