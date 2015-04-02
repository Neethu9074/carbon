'use strict';

import Pathfinding from 'pathfinding';


class GridPathfinder{
  constructor() {
    const width = 400;
    this.width = width;

    //create grid for pathfinding. for each cube, pathfinding knows 100 quads
    this.grid = new Pathfinding.Grid(width, width);

    const grid = this.grid;
    const fieldWidth = 20;
    const holeWidth = 16;
    const offset = (fieldWidth - holeWidth) / 2;

    for (let x = 0; x < width; x += fieldWidth) {
      for (let y = 0; y < width; y += fieldWidth) {
        for (let xGap = 0; xGap <= holeWidth; xGap++) {
          for (let yGap = 0; yGap <= holeWidth; yGap++) {
            grid.setWalkableAt(x + xGap + offset, y + yGap + offset, false);
          }
        }
      }
    }
  }

  getPath(from, to) {
    const width = this.width;

    const fx = (from.x + (width / 2));
    const fy = (from.z + (width / 2));
    const tx = (to.x + (width / 2));
    const ty = (to.z + (width / 2));

    //important to make a copy! the pathfinder would use the older path if
    //you don't clone the inital grid
    const grid = this.grid.clone();

    const finder = new Pathfinding.AStarFinder({
      dontCrossCorners: true,
      allowDiagonal: true
    });

    let path = finder.findPath(fx, fy, tx, ty, grid);

    //compress path to massively reduce lines. compressing does:
    //[[0, 1], [0, 2], [0, 3], [0, 4]] => [[0, 1], [0, 4]]
    path = Pathfinding.Util.compressPath(path);

    if (path.length > 1) {
      return path;
    } else {
      return undefined;
    }
  }

  getFreeFields() {
    const freeOnes = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.width; y++) {
        if(this.grid.isWalkableAt(x, y)){
          freeOnes.push( {x: x, y: y } );
        }
      }
    }
    return freeOnes;
  }
}

export default GridPathfinder;
