'use strict';

import THREE from 'three';

import SceneObject from './SceneObject';
import colors from '../colors';

export default class Host extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});
    this.id = snapshot.get('hostId');
    this.snapshot = snapshot;
    this.render();
    this.addStickyNote();
  }

  render() {
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

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), finalMat);
    this.addSceneObject(this.cube);
  }

  addStickyNote() {

  }

  setLocalPosition(position) {
    super.setLocalPosition(position);
    this.cube.position.copy(this.getWorldPosition());
  }

  onUpdate(snapshot) {
    this.snapshot = snapshot;
  }
}
