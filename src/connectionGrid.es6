'use strict';

import THREE from 'three';
import PF from 'pathfinding';


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
    this.grid.setWalkableAt(
      position.x + this.width / 2,
      -position.z + this.height / 2,
      true);
  }

  blockPosition(position) {
    this.grid.setWalkableAt(
      position.x + this.width / 2,
      -position.z + this.height / 2,
      false);
  }

  getPath({fromX, fromY, toX, toY}) {
    let path = this.finder.findPath(fromX, fromY, toX, toY, this.grid.clone());

    //compress path to reduce lines:
    //[[0, 1], [0, 2], [0, 3], [0, 4]] => [[0, 1], [0, 4]]
    path = PF.Util.compressPath(path);

    return path;
  }

  asVisualObject() {
    const dimX = this.width;
    const dimZ = this.height;
    const geometry = new THREE.BufferGeometry();
    const geoPos = new Float32Array(dimX * dimZ * 3);

    let index = 0;
    for(let x = 0; x < dimX; x++) {
      for(let z = 0; z < dimZ; z++) {
        if(this.grid.isWalkableAt(x, z)) {
          geoPos[index] = x - dimX / 2;
          geoPos[index + 1] = 0;
          geoPos[index + 2] = -z + dimZ / 2;
        } else {
            geoPos[index] = Infinity;
        }
        index += 3;
      }
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(geoPos, 3));
    return new THREE.PointCloud(geometry, new THREE.PointCloudMaterial());
  }

  dispose() {

  }
}

const grid = new ConnectionGrid();
export default grid;
