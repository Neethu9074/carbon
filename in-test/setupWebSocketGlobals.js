/*eslint-env node*/
/*eslint-disable no-var*/

'use strict';

module.exports = function() {
  global.window = global.window || {};
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
};
