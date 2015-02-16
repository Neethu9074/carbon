'use strict';

var PF = require('./extensions/pathfinding-browser.min');

exports.GroundSpaceControl2D = function GroundSpaceControl2D(dimension) {
	this.width = dimension;
	this.height = dimension;
	this.gap = 5; //the gap between the cubes must be element of Z+
	this.blockedMarker = 'blocked';
	this.cubeMarker = 'cube';

	var ground = create2DArray(dimension);
	this.ground = ground;

	//create grid for pathfinding
	this.grid = new PF.Grid(dimension, dimension);
};

function create2DArray(rows) {
	var array = [];
	for (var i = 0; i < rows; i++) {
		array[i] = [];
	}
	return array;
}

exports.GroundSpaceControl2D.prototype.getFreeWalkableFields = function() {
	var freeFields = [];
	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			if (this.grid.isWalkableAt(x, y)) {
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
	return freeFields;
};

exports.GroundSpaceControl2D.prototype.getFreeFields = function() {
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
	return freeFields;
};

exports.GroundSpaceControl2D.prototype.getNearestFreeField = function(
	width) {
	var freeFields = this.getFreeFields();
	for (var i = 0; i < freeFields.length; i++) {
		var result = freeFields[i];

		//if free field is big enough
		if (this.isPossible(result.x, result.y, width, width)) {
			this.blockArea(result.x, result.y, width, width);
			return result;
		}
	}

	return undefined;
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
exports.GroundSpaceControl2D.prototype.blockArea = function(
	from, to, width, height) {
	for (var x = -this.gap; x < width + this.gap; x++) {
		for (var y = -this.gap; y < height + this.gap; y++) {
			if (from + x < 0 || to + y < 0) {	continue;	}
			var xPos = from + x;
			var yPos = to + y;
			//check if the field[x,y] is in the peripheral area
			if (x < 0 || x > width - 1 || y < 0 || y > height - 1) {
				this.ground[xPos][yPos] = this.blockedMarker;
			} else {
				//otherwise the field[x,y] is on the cube
				this.ground[xPos][yPos] = this.cubeMarker;
			}
		}
	}

  //block the fields around the cube with a gapsize of 1
	if (this.gap > 0) {
		var gapSizeForPath = 1;
		for (x = -gapSizeForPath; x < width + gapSizeForPath; x++) {
			for (y = -gapSizeForPath; y < height + gapSizeForPath; y++) {
				xPos = from + x;
				yPos = to + y;
				if (xPos < 0 || yPos < 0) {	continue; }
				if (xPos >= this.ground.length ||
						yPos >= this.ground[xPos].length) { continue; }
        //block the field, so that it is not available for pathfinding
				this.grid.setWalkableAt(xPos, yPos, false);
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
exports.GroundSpaceControl2D.prototype.isPossible = function(
	from, to, width, height) {
	for (var x = 0; x <= width + this.gap; x++) {
		for (var y = 0; y <= height + this.gap; y++) {
			var xPos = from + x;
			var yPos = to + y;
			if (xPos >= this.ground.length ||
					yPos >= this.ground[xPos].length) { continue; }
			if (this.ground[xPos][yPos] !== undefined) {
				return false;
			}
		}
	}
	return true;
};

//from and to are objects of type { x, y, width, height }
exports.GroundSpaceControl2D.prototype.getPath = function(from, to) {
	//clone the grid because it gets updated
	var grid = this.grid.clone();

	//clear the areas of the source and the desination,
	// so that the algorithms won't start in a blocked area
	//and no path could be found
	this.clearGridFromCube(grid, from);
	this.clearGridFromCube(grid, to);

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

/*
 * searched the area for 'cubed' fields and set them to undefined.
 * so that they can be used again
 *  __
 * |__| -> free field, but blocked (here: gap size = 1)
 *
 * |||| -> the cube
 *  ___________				   ___________
 * |__|__|__|__| 				|__|__|__|__|			 __
 * |__|||||||__| 	==>		|__|__|__|__|	==>	|__| -> free field
 * |__|||||||__| 				|__|__|__|__|
 * |__|__|__|__|				|__|__|__|__|
 */
exports.GroundSpaceControl2D.prototype.clearGridFromCube = function(ground,
	cube) {
	var widthOfCube = cube.width + 2;
	var heightOfCube = cube.height + 2;
	var fromX = cube.x - 1;
	var fromY = cube.y - 1;
	for (var x = fromX; x < widthOfCube + fromX; x++) {
		for (var y = fromY; y < heightOfCube + fromY; y++) {
      if (x < 0 || y < 0) {	continue; }
			ground.setWalkableAt(x, y, true);
		}
	}
};
