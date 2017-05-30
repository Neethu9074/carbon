/* global require:false */

if ('Map' in window === false) {
  var Map = require('es6-map/polyfill');
  window.Map = Map;
}
