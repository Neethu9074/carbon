/* global require:false */

window.LOADER = {};
require('in-map/lib/OBJLoader.es6');
const OBJ_LOADER = new window.LOADER.OBJLoader();

export function loadObject(url, callback) {
  OBJ_LOADER.load(url, object => callback(object));
}
