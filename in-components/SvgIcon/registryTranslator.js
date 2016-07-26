/* eslint-env node */

// Execute via
//
// npm run translateIconRegistry
//

const path = require('path');
const fs = require('fs');

const icons = require('./registry');

const result = {};

Object.keys(icons).sort().forEach(name => {
  const icon = icons[name];
  const width = icon.width || 128;
  const height = icon.height || 128;
  result[name] = {
    width,
    height,
    ratio: width / height,
    path: icon.path
  };
});


fs.writeFileSync(path.join(__dirname, 'registry.json'), JSON.stringify(result, 0, 2));
