/*eslint-env mocha,node*/
'use strict';

var jsdom = require('jsdom');
var chai = require('chai');

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

// support a HTML5-like environment
global.document = jsdom.jsdom('<html><head></head><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
global.window.location = {
  origin: 'http://demo.internal.instana.io'
};
global.window.WebSocket = function() {
  this.send = function() {};
  this.close = function() {};
};

['localStorage', 'sessionStorage'].forEach(function(type) {
  var storage = {};
  global.window[type] = {
    setItem: function(k, v) {
      storage[k] = v + '';
    },
    getItem: function(k) {
      return storage[k];
    }
  };
});
