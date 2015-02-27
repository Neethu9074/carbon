'use strict';

var blocked = 'blocked';

exports.Layouter2DServer = function Layouter2DServer(width, height) {
  this.width = width;
  this.height = height;

  this.grid = new Array(width);
  for (var i = 0; i < width; i++) {
    this.grid[i] = new Array(height);
  }
};

exports.Layouter2DServer.prototype.getNext = function(width, height) {
  var free = this.getFree(width, height);
  if (free.length === 0) {
    throw 'no more empty fields';
  } else {
    free.sort(function(a, b) {
      return (a.x - b.x) + (a.y - b.y);
    });
    var nearest = free[0];
    this.block(nearest, width, height);
    return nearest;
  }
};

/*
 * sets the area around the given x, y, width, height.
 * any value -> it cant be used anymore
 * undefined -> it can be used
 *  __
 * |__| -> free field, but blocked (here: gap size = 1)
 *
 * |||| -> the cube
 *  ___________
 * |__|__|__|__|
 * |__|||||||__|
 * |__|||||||__|
 * |__|__|__|__|
 */
exports.Layouter2DServer.prototype.block = function(xy, width, height) {
  for (var w = xy.x; w < xy.x + width; w++) {
    for (var h = xy.y; h < xy.y + height; h++) {
      if (w >= this.width || h >= this.height) {
        continue;
      }
      this.grid[w][h] = blocked;
    }
  }
};

exports.Layouter2DServer.prototype.getFree = function(width, height) {
  var grid = this.grid;
  var free = [];
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if (grid[x][y] === undefined) {
        var isFree = true;

        //search if there is enough space
        for (var w = 0; w < width; w++) {
          for (var h = 0; h < height; h++) {
            if (x + w >= this.width || y + h >= this.height) {
              isFree = false;
              continue;
            }
            if (grid[x + w][y + h] !== undefined) {
              isFree = false;
            }
          }
        }

        if (isFree) {
          free.push({
            x: x,
            y: y
          });
        }
      }
    }
  }
  return free;
};

exports.Layouter2DServer.prototype.setFree = function(x, y, width, height) {
  var grid = this.grid;

  for (var xPos = x; x < width + x; x++) {
    for (var yPos = y; y < height + y; y++) {
      grid[xPos][yPos] = undefined;
    }
  }
};
