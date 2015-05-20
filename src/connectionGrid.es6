'use strict';

import PF from 'pathFinding';


class ConnectionGrid {

  constructor() {
    this.width = 100;
    this.height = 100;

    this.grid = new PF.Grid(this.width, this.height);

    this.finder = new PF.IDAStarFinder({
      dontCrossCorners: false,
      allowDiagonal: false
    });
  }

  clearPosition(position) {
    this.grid.setWalkableAt(position.x, -position.z, true);
  }

  blockPosition(position) {
    this.grid.setWalkableAt(position.x, -position.z, false);
  }

  getPath({fromX, fromY, toX, toY}) {
    let path = this.finder.findPath(fromX, fromY, toX, toY, this.grid.clone());

    //compress path to reduce lines:
    //[[0, 1], [0, 2], [0, 3], [0, 4]] => [[0, 1], [0, 4]]
    path = PF.Util.compressPath(path);

    return path;
  }

  dispose() {

  }
}

const grid = new ConnectionGrid();
export default grid;
