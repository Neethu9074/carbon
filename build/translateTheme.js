/*eslint-env node*/
/*eslint-disable no-var*/

'use strict';

var fs = require('fs');
var path = require('path');
var themes = require('../in-themes/js');

var stylesheet = '';
Object.keys(themes.consts).forEach(function(theme) {
  walkConstants([], themes.consts[theme]);
});
stylesheet = stylesheet.trim();
fs.writeFileSync(
  path.join(__dirname, '../in-themes/less/constants.less'),
  stylesheet
);

function walkConstants(pathToWalk, obj) {
  Object.keys(obj).forEach(function(key) {
    var value = obj[key];
    if (typeof value === 'string' || typeof value === 'number') {
      addConstant(pathToWalk.concat(key), value);
    } else if (typeof value === 'object' && !(value instanceof Array)) {
      walkConstants(pathToWalk.concat(key), value);
      stylesheet += '\n';
    }
  });
}

function addConstant(targetPath, value) {
  var key = toSpinalCase(targetPath.join('__'));
  stylesheet += '@' + key + ': ' + value + ';\n';
}

function toSpinalCase(name) {
  return name.replace(/([a-z])([A-Z])/g, function(match, g1, g2) {
    return g1 + '-' + g2.toLowerCase();
  });
}
