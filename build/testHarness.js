/*eslint-env mocha,node*/
/*eslint-disable no-var*/

'use strict';

// Set our default time zone so that tests with date formatting are predictable.
process.env.TZ = 'Europe/Berlin';

var chai = require('chai');
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

// many tests import a whole bunch of modules and at some point this always
// ends up in in-services/connection (which requirs WebSocket globals).
setupWebSocketGlobals();
