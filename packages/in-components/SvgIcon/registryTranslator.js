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
