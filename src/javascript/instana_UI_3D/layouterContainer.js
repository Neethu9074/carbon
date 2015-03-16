'use strict';

exports.LayouterContainer = function LayouterContainer(width) {
  this.width = width;
  this.height = width;

  this.grid = new Array(width);
  for (var i = 0; i < width; i++) {
    this.grid[i] = new Array(width);
  }
};

exports.LayouterContainer.prototype.getNext = function() {
  var free = this.getFree();
  if (free.length === 0) {
    throw 'no more empty fields';
  } else {
    free.sort(function(a, b) {
      return (a.x - b.x) + (a.y - b.y); //manhattan distance
    });
    return free[0];
  }
};

exports.LayouterContainer.prototype.getFree = function() {
  var grid = this.grid;
  var free = [];
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      if (grid[x][y] === undefined) {
        free.push({
          x: x,
          y: y
        });
      }
    }
  }
  return free;
};

/*
 * sets the area around the given x, y, width, height.
 * any value -> it cant be used anymore
 * undefined -> it can be used
 */
exports.LayouterContainer.prototype.setBlocked = function(xy, marker) {
  this.grid[xy.x][xy.y] = marker;
};

exports.LayouterContainer.prototype.setFree = function(marker) {
  var grid = this.grid;
  var width = this.width;
  var height = this.height;

  for (var xPos = 0; xPos < width; xPos++) {
    for (var yPos = 0; yPos < height; yPos++) {
      if(grid[xPos][yPos] === marker) {
        grid[xPos][yPos] = undefined;
      }
    }
  }
};
