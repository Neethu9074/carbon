'use strict';

import THREE from 'three.js';

import SceneObject from './SceneObject';
import colors from '../colors';
import * as HostCubeFactory from '../factories/hostCubeFactory';


export default class Host extends SceneObject {

  constructor({parent, id}) {
    super({parent});

    this.id = id;

    const pos = this.getWorldPosition();
    HostCubeFactory.getInstance().addFragment({
      id: id,
      pos: pos.clone().add(new THREE.Vector3(
        0,
        0,
        0
      )),
      dim: new THREE.Vector3(1, 1, 1)
    });
  }

  setLocalPosition(position) {
    // console.log(position);
    super.setLocalPosition(position);

    HostCubeFactory.getInstance().removeFragment(this.id);

    const worldPosition = this.getWorldPosition();
    console.log(worldPosition);
    HostCubeFactory.getInstance().addFragment({
      id: this.id,
      pos: worldPosition,
      dim: new THREE.Vector3(1, 1, 1)
    });
  }
}
