'use strict';

exports.GroundSpaceControl2D = function GroundSpaceControl2D(width, height) {
  this.width = width;
  this.height = height;
  var ground = create2DArray(width);
  this.ground = ground;
};

function create2DArray(rows) {
  var arr = [];
  for (var i = 0; i < rows; i++) {
    arr[i] = [];
  }
  return arr;
}

exports.GroundSpaceControl2D.prototype.getNearestFreeField = function(
  width, height) {
  var freeFields = [];
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if (this.ground[x][y] === undefined) {
        //add to temp collection
        freeFields.push({
          x: x,
          y: y
        });
      }
    }
  }

  freeFields.sort(function(a, b) {
    return (a.x + a.y) - (b.x + b.y); //manhattan distance
  });

  for (var i = 0; i < freeFields.length; i++) {
    var result = freeFields[i];

    //if free field is big enough
    if (this.isPossible(result.x, result.y, width, height)) {
			this.setArea(result.x, result.y, width, height, true);
      return result;
    }
  }

  return undefined;
};

//sets the area around the given x, y, width, height.
//any value -> it cant be used anymore
//undefined -> it can be used
exports.GroundSpaceControl2D.prototype.setArea = function(from, to, width,
  height, value) {
		for (var x = -1; x < width + 1; x++) {
			for (var y = -1; y < height + 1; y++) {
				var xPos = Math.max(0, from + x);
				var yPos = Math.max(0, to + y);
				this.ground[xPos][yPos] = value;
			}
		}
}

//checks the area around a given point and checks, if any field is blocked
//true -> not possible to use
//false -> is possible to use
exports.GroundSpaceControl2D.prototype.isPossible = function(xPos, yPos, width,
  height) {
  for (var x = xPos; x <= xPos + width + 1; x++) {
    for (var y = yPos; y <= xPos + height + 1; y++) {
      if (this.ground[x][y] !== undefined) {
        return false;
      }
    }
  }
  return true;
};
