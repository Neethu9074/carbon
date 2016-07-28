import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';


export default class Node extends SceneObject {

  constructor(params) {
    super(params.id);
  }

  init() {
    super.init();

    const mesh = this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
      new THREE.MeshBasicMaterial()
    );

    mesh.position.set(0, 0, -10);

    addSceneObject(mesh);
  }

  dispose() {
    super.dispose();

    removeSceneObject(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;
  }
}
