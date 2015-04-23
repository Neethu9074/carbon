'use strict';

import THREE from 'three';

import SceneObject from './SceneObject';
import colors from '../colors';
import * as HostCubeFactory from '../factories/hostCubeFactory';


export default class Host extends SceneObject {

  constructor({parent, id}) {
    super({parent});

    this.id = id;

    const mat = new THREE.MeshBasicMaterial({
      color: 0x606060,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
    this.addSceneObject(this.cube);
  }

  setLocalPosition(position) {
    super.setLocalPosition(position);
    this.cube.position.copy(this.getWorldPosition());
  }
}
