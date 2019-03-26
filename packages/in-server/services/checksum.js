'use strict';

const crypto = require('crypto');
const fs = require('fs');

exports.getChecksumForFile = function getChecksumForFile(path) {
  return crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex').substring(0, 10);
};
