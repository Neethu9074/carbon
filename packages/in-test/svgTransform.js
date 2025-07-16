/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
const path = require('path');

module.exports = {
  process(filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  }
};
