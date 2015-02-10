'use strict';

var cube = require('./cube');
var connection = require('./connection');

module.exports = function createTestSetup(app) {
  var gc = app.groundControl;
  var xy;
  var lastAddedCube;

  //add a few cubes
  for (var i = 0; i < 10; i++) {
    var x = Math.floor(Math.random() * 3) + 1;
    var y = Math.floor(Math.random() * 3) + 1;
    xy = gc.getNearestFreeField(x, y);
    if (xy !== undefined) {
      var newCube = new cube.Cube(xy.x, xy.y, x, y, 0.4);
      app.addObject(newCube);

      if (lastAddedCube !== undefined) {
        app.addObject(new connection.Connection(lastAddedCube, newCube));
      }

      lastAddedCube = newCube;
    }
  }
};
