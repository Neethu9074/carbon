/* eslint-env mocha,node */
/* eslint-disable no-var, vars-on-top, strict */

'use strict';

// Set our default time zone so that tests with date formatting are predictable.
process.env.TZ = 'Europe/Berlin';

var chai = require('chai');
var jsdom = require('jsdom');

var setupWebSocketGlobals = require('../in-test/setupWebSocketGlobals');
var setupThemeGlobals = require('../in-test/setupThemeGlobals');

chai.use(require('chai-string'));
chai.use(require('chai-subset'));
chai.use(require('sinon-chai'));

// support static file require statements
['.png', '.obj', '.less', '.css', '.svg', '.glsl'].forEach(extension => {
  require.extensions[extension] = () => {
    return `a ${extension} module`;
  };
});

// support ES6
require('babel-core/register')({
  only: /es6/,
  ignore: '^$',
  presets: ['es2015', 'react', 'stage-2']
});

// Ensuring a browser environment is simulated before React is loaded to avoid
// "Error: Invariant Violation: Markup wrapping node not initialized"
// Also see:
// https://github.com/facebook/react/issues/3840
global.document = jsdom.jsdom('<html><head></head><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
global.__DEV__ = false;
global.window.instana = {
  config: {
    environment: 'saas'
  }
};

global.requestAnimationFrame = fn => fn();

// ensure that the theme information is defined
setupThemeGlobals();

// many tests import a whole bunch of modules and at some point this always
// ends up in in-services/persistentConnection (which requirs WebSocket globals).
setupWebSocketGlobals();
