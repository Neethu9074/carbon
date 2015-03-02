'use strict';

var PF = require('./extensions/pathfinding-browser.min');

exports.Layouter2D = function Layouter2D(width, height) {
  this.width = width;
  this.height = height;

  this.grid = new Array(width);
  for (var i = 0; i < width; i++) {
    this.grid[i] = new Array(height);
  }

  //create grid for pathfinding. for each cube, pathfinding knows 100 quads
  this.walkingGrid = new PF.Grid(width * 16, height * 16);
};

exports.Layouter2D.prototype.getNext = function(width, height) {
  var free = this.getFree(width, height);
  if (free.length === 0) {
    throw 'no more empty fields';
  } else {
    free.sort(function(a, b) {
      return (a.x - b.x) + (a.y - b.y);
    });
    var nearest = free[0];
    return nearest;
  }
};

/*
 * sets the area around the given x, y, width, height.
 * any value -> it cant be used anymore
 * undefined -> it can be used
 */
exports.Layouter2D.prototype.setBlocked = function(xy, width, height, marker) {
  for (var w = xy.x; w < xy.x + width; w++) {
    for (var h = xy.y; h < xy.y + height; h++) {
      if (w >= this.width || h >= this.height) {
        continue;
      }
      this.grid[w][h] = marker;
    }
  }

  //also block for pathfinding
  this.blockForWalkable(xy, width, height);
};

exports.Layouter2D.prototype.setFree = function(marker) {
  var grid = this.grid;
  var width = this.width;
  var height = this.height;

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      if(grid[x][y] === marker) {
        grid[x][y] = undefined;

        //also set the pathfinding grid free...
        this.freeForWalkable(this.walkingGrid, x * 16, y * 16, 16, 16);
      }
    }
  }
};

/*
 * checks the area around a given point and checks, if any field is blocked
 * true -> not possible to use
 * false -> is possible to use
 *  __
 * |__| -> free field, but blocked (here: gap size = 1)
 *
 * |||| -> the cube
 *  ________
 * |__|__|__|
 * |||||||__|
 * |||||||__|
 */
exports.Layouter2D.prototype.blockForWalkable = function(xy, w, h) {
  var grid = this.walkingGrid;

  var fX = xy.x * 16 + 2,
      fY = xy.y * 16 + 2,
      tX = fX + w * 16 - 5,
      tY = fY + h * 16 - 5;

  for (var x = fX; x < tX; x++) {
    for (var y = fY; y < tY; y++) {
      grid.setWalkableAt(x, y, false);
    }
  }
};

exports.Layouter2D.prototype.freeForWalkable = function(grid, x, y, w, h) {
  for (var xPos = x; xPos < x + w; xPos++) {
    for (var yPos = y; yPos < y + h; yPos++) {
      grid.setWalkableAt(xPos, yPos, true);
    }
  }
};

exports.Layouter2D.prototype.getFree = function(width, height) {
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

exports.Layouter2D.prototype.getFreeWalkable = function() {
  var freeFields = [];
  var grid = this.walkingGrid;
  for (var x = 0; x < grid.width; x++) {
    for (var y = 0; y < grid.height; y++) {
      if (grid.isWalkableAt(x, y)) {
        //add to temp collection
        freeFields.push({
          x: x,
          y: y
        });
      }
    }
  }
  return freeFields;
};

//from and to are objects of type { x, y, width, height }
exports.Layouter2D.prototype.getPath = function(from, to) {
  //clone the grid because it gets updated
  var grid = this.walkingGrid.clone();

  //clear the areas of the source and the desination,
  // so that the algorithms won't start in a blocked area
  //and no path could be found
  this.freeForWalkable(grid, from.x, from.y, from.width, from.depth);
  this.freeForWalkable(grid, to.x, to.y, to.width, to.depth);

  var finder = new PF.AStarFinder({
    dontCrossCorners: true,
    allowDiagonal: true
  });

  var fromX = from.x;
  var fromY = from.y;
  var toX = to.x;
  var toY = to.y;

  var path = finder.findPath(fromX, fromY, toX, toY, grid);
  //compress path to massively reduce lines. compressing does:
  //[[0, 1], [0, 2], [0, 3], [0, 4]] => [[0, 1], [0, 4]]
  var compressedPath = PF.Util.compressPath(path);

  if (compressedPath.length > 1) {
    return compressedPath;
  } else {
    return undefined;
  }
};
