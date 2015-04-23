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
    const obj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    obj.position
      .copy(pos)
      .add(new THREE.Vector3(
        Math.ceil(Math.random() * 5),
        0,
        Math.ceil(Math.random() * 5)));
    obj.updateMatrix();

/*
    HostCubeFactory.getInstance().addFragment({
      ID: Math.random(),
      cube: obj
    });
*/

    this.cube = obj;
    this.addSceneObject(obj);
  }

  setLocalPosition(position) {
    //console.log(position);
    super.setLocalPosition(position);

    //HostCubeFactory.getInstance().removeFragment(this.id);

    const worldPosition = this.getWorldPosition();
    this.cube.position.copy(worldPosition);
  }
}
