/* eslint-env node */

const fs = require('fs');
const path = require('path');

module.exports = function main(themeName, sourceDir, targetDir, targetName) {
  const theme = require(path.join(sourceDir, themeName + '.js'));

  var stylesheet = '';
  walkConstants([], theme);
  stylesheet = stylesheet.trim();
  fs.writeFileSync(
    path.join(targetDir, targetName + '.less'),
    stylesheet
  );
  fs.writeFileSync(
    path.join(targetDir, targetName + '.json'),
    JSON.stringify(theme, 0, 2)
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
};

function toSpinalCase(name) {
  return name.replace(/([a-z])([A-Z])/g, function(match, g1, g2) {
    return g1 + '-' + g2.toLowerCase();
  });
}
