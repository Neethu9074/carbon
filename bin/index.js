'use strict';

var fs = require('fs');
var path = require('path');
var themes = require('../js');

var stylesheet = '';
Object.keys(themes.consts).forEach(function(theme) {
  walkConstants([], themes.consts[theme]);
});
stylesheet = stylesheet.trim();
fs.writeFileSync(
  path.join(__dirname, '../less/constants.less'),
  stylesheet
);

function walkConstants(path, obj) {
  Object.keys(obj).forEach(function(key) {
    var value = obj[key];
    if (typeof value === 'string') {
      addConstant(path.concat(key), value);
    } else if (typeof value === 'object' && !(value instanceof Array)) {
      walkConstants(path.concat(key), value);
      stylesheet += '\n';
    }
  });
}

function addConstant(path, value) {
  var key = toSpinalCase(path.join('__'));
  stylesheet += '@' + key + ': ' + value + ';\n';
}

function toSpinalCase(name) {
  return name.replace(/([a-z])([A-Z])/, function(match, g1, g2) {
    return g1 + '-' + g2.toLowerCase();
  })
}
