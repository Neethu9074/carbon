'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import DataPackageAnimation from './dataPackagePathAnimation';
import * as colors from '../colors';

import systemImagePath from '../../../images/icon_system.png';
import logging from 'instalog';
const logger = logging.createLogger('cubeConnection.js');


class CubeConnection extends SceneObject {
  constructor(a, b, bidirectional = false) {
		const from = a.position.clone().add(new THREE.Vector3(-1, 0, -1));
    const to = b.position.clone().add(new THREE.Vector3(-1, 0, -1));

    //call super constructor
    super('ground', a.position, a.dimension);

    logger.info('connect', a.ID, 'with', b.ID);
    this.path = this.createPath([from, to], bidirectional);
    this.app.scene.add(this.path);
  }

  createPath(points, bidirectional) {
    const path = this.app.pathFinder.getPath(points[0], points[1]);
		this.createDataPackageAnimation(path, bidirectional);

    const geo = new THREE.BufferGeometry();
    const geoPos = new Float32Array(path.length * 3);

    let index = 0;
    for (let i = 0; i < path.length; i++) {
      const position = path[i];

      geoPos[index] = position[0];
      geoPos[index + 1] = 0.2; //hover over the ground
      geoPos[index + 2] = position[1];

      index += 3;
    }
    geo.addAttribute('position', new THREE.BufferAttribute(geoPos, 3));

    const mat = new THREE.LineBasicMaterial({
      color: colors.connectionColor
    });
    const line = new THREE.Line(geo, mat);
    return line;
  }

	createDataPackageAnimation(path, bidirectional) {
		this.animation = new DataPackageAnimation(path, bidirectional);
	}

  dispose() {
    super.dispose();

		this.animation.dispose();

    this.path.geometry.dispose();
    this.path.material.dispose();
    this.path = null;
  }
}

export default CubeConnection;
