'use strict';

var fs = require('fs');
var path = require('path');


var variables = turnToNestedStructure(getVariables());
writeToJsFile(variables);
console.log('Successfully build the JS version of the variables.');

function getVariables() {
  var variableRegex = /@([0-9a-z-_]+):[ ]*([^;]*);/ig;
  var content = fs.readFileSync(
    path.join(__dirname, '../less/variables.less'),
    { encoding: 'utf8' }
  );

  var match;
  var result = {};
  while ((match = variableRegex.exec(content)) !== null) {
    result[match[1]] = match[2];
  }
  return result;
}

function turnToNestedStructure(variables) {
  var nestedVariables = {};
  Object.keys(variables).forEach(function(key) {
    deepSet(nestedVariables, key, variables[key]);
  });
  return nestedVariables;
}

function deepSet(obj, key, value) {
  var path = key.split('__').map(camelCasify);
  for (var i = 0, len = path.length - 1; i < len; i++) {
    var pathElement = path[i];
    if (obj[pathElement] === undefined) {
      obj[pathElement] = {};
    }
    obj = obj[pathElement];
  }
  obj[path[path.length - 1]] = value;
}

function camelCasify(s) {
  return s.replace(/-([a-z0-9])/i, function(match, g1) {
    return g1.toUpperCase();
  });
}

function writeToJsFile(variables) {
  var content = '"use strict";\n\n' +
    'module.exports = ' + JSON.stringify(variables, 0, 2) + ';';
  fs.writeFileSync(
    path.join(__dirname, '../js/index.js'),
    content
  );
}
