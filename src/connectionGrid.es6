'use strict';

import THREE from 'three';
import PF from 'pathfinding';
import {createLogger} from 'instalog';

const logger = createLogger('ui-map.stickyNote.Host.index');


class ConnectionGrid {

  constructor() {
    this.width = 100;
    this.height = 100;

    this.grid = new PF.Grid(this.width, this.height);

    this.finder = new PF.BestFirstFinder({
      dontCrossCorners: true,
      allowDiagonal: false,
      bidirectional: false
    });
  }

  clearPosition(position) {
    this.setWalkableAt(position.x, -position.z, true);
  }

  blockPosition(position) {
    this.setWalkableAt(position.x, -position.z, false);
  }

  setWalkableAt(x, y, value) {
    try {
      this.grid.setWalkableAt(x, y, value);
    } catch(err) {
      logger.debug('cannot set position for:', x, y);
      logger.error(err);
    }
  }

  getPath({fromX, fromY, toX, toY}) {
    let path = this.finder.findPath(fromX, fromY, toX, toY, this.grid.clone());

    //compress path to reduce lines:
    //[[0, 1], [0, 2], [0, 3], [0, 4]] => [[0, 1], [0, 4]]
    path = PF.Util.compressPath(path);

    return path;
  }

  /*eslint-disable max-statements */
  asVisualObject() {
    const dimX = this.width;
    const dimZ = this.height;
    const geometry = new THREE.BufferGeometry();
    const geoPos = new Float32Array(dimX * dimZ * 3);

    let index = 0;
    for(let x = 0; x < dimX; x++) {
      for(let z = 0; z < dimZ; z++) {
        if(this.grid.isWalkableAt(x, z)) {
          geoPos[index] = x - 0.5;
          geoPos[index + 1] = 0;
          geoPos[index + 2] = -z + 0.5;
        } else {
          geoPos[index] = -0.5;
          geoPos[index + 2] = 0.5;
        }
        index += 3;
      }
    }
    geometry.addAttribute('position', new THREE.BufferAttribute(geoPos, 3));
    return new THREE.PointCloud(geometry, new THREE.PointCloudMaterial());
  }
  /*eslint-enable max-statements */

  dispose() {

  }
}

const grid = new ConnectionGrid();
export default grid;
