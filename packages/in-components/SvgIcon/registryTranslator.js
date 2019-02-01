/* eslint-env node */

// Execute via
//
// yarn run translateIconRegistry
//

const path = require('path');
const fs = require('fs');

const icons = require('./registry');

const result = {};

Object.keys(icons)
  .sort()
  .forEach(name => {
    const icon = icons[name];
    let width = icon.width || 128;
    let height = icon.height || 128;
    if (name.indexOf('lib_') === 0) {
      width = 24;
      height = 24;
    }
    result[name] = {
      width,
      height,
      ratio: width / height,
      path: icon.path
    };
  });

fs.writeFileSync(path.join(__dirname, 'registry.json'), JSON.stringify(result, 0, 2));
