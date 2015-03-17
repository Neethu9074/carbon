'use strict';

class LayouterContainer{
  constructor(width) {
    this.width = width;
    this.height = width;

    this.grid = new Array(width);
    for (let i = 0; i < width; i++) {
      this.grid[i] = new Array(width);
    }
  }

  getNext() {
    const free = this.getFree();
    if (free.length === 0) {
      throw 'no more empty fields';
    } else {
      free.sort(function(a, b) {
        return (a.x - b.x) + (a.y - b.y); //manhattan distance
      });
      return free[0];
    }
  }

  getFree() {
    const grid = this.grid;
    const free = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (grid[x][y] === undefined) {
          free.push({
            x: x,
            y: y
          });
        }
      }
    }
    return free;
  }

  /*
   * sets the area around the given x, y, width, height.
   * any value -> it cant be used anymore
   * undefined -> it can be used
   */
  setBlocked(xy, marker) {
    this.grid[xy.x][xy.y] = marker;
  }

  setFree(marker) {
    const grid = this.grid;
    const width = this.width;
    const height = this.height;

    for (let xPos = 0; xPos < width; xPos++) {
      for (let yPos = 0; yPos < height; yPos++) {
        if(grid[xPos][yPos] === marker) {
          grid[xPos][yPos] = undefined;
        }
      }
    }
  }
}

export default LayouterContainer;
