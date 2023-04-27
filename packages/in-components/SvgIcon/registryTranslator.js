/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-env node */

// Execute via
//
// yarn run translateIconRegistry
//

const path = require('path');
const fs = require('fs');

const icons = require('./registry');

const result = {};

Object.keys(icons).forEach(name => {
  result[name] = {
    path: icons[name].path
  };
});

fs.writeFileSync(path.join(__dirname, 'registry.json'), JSON.stringify(result, 0, 2));
