/*eslint-env node*/
/*eslint-disable no-var, strict*/

'use strict';

var activeThemeConfig = require('in-themes/active.json');

module.exports = function setupThemeGlobals() {
  global.window.instana = global.window.instana || {};

  global.window.instana.activeTheme = 'night';
  global.window.instana.activeThemeConfig = activeThemeConfig;
};
