/*eslint-env mocha,node*/
/*eslint-disable no-var, vars-on-top, strict*/

'use strict';

// Set our default time zone so that tests with date formatting are predictable.
process.env.TZ = 'Europe/Berlin';

var chai = require('chai');
var jsdom = require('jsdom');
var setupWebSocketGlobals = require('../in-test/setupWebSocketGlobals');

chai.use(require('chai-string'));
chai.use(require('chai-subset'));
chai.use(require('sinon-chai'));

// support static file require statements
['.png', '.obj', '.less', '.svg', '.glsl'].forEach(function(extension) {
  require.extensions[extension] = function(module) {
    return module;
  };
});

// support ES6
require('babel/register')({
  only: /es6/,
  ignore: '^$'
});

// support TypeScript
require('typescript-require');

// Ensuring a browser environment is simulated before React is loaded to avoid
// "Error: Invariant Violation: Markup wrapping node not initialized"
// Also see:
// https://github.com/facebook/react/issues/3840
global.document = jsdom.jsdom('<html><head></head><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

// many tests import a whole bunch of modules and at some point this always
// ends up in in-services/connection (which requirs WebSocket globals).
setupWebSocketGlobals();
