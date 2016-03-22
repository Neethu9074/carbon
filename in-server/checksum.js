'use strict';

const crypto = require('crypto');
const fs = require('fs');

exports.getSriIntegrityForFile = function getSriIntegrityForFile(path) {
  return 'sha256-' + crypto.createHash('sha256').update(fs.readFileSync(path)).digest('base64');
};

exports.getChecksumForFile = function getChecksumForFile(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex').substring(0, 10);
};
