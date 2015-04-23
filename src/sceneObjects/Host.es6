'use strict';

import THREE from 'three.js';

import SceneObject from './SceneObject';
import colors from '../colors';
import * as HostCubeFactory from '../factories/hostCubeFactory';


export default class Host extends SceneObject {

  constructor({parent, id}) {
    super({parent});

    this.id = id;

    const mat = new THREE.MeshBasicMaterial({
      color: 0x232d36,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });
    const matB = new THREE.MeshBasicMaterial({
      color: 0x323d45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });
    const matC = new THREE.MeshBasicMaterial({
      color: 0x37424a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });

    const mats = [
      mat, matB, matC, mat, matB, matC
    ];
    const finalMat = new THREE.MeshFaceMaterial(mats);

    const obj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), finalMat);

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
