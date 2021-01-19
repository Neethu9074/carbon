/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { MeshBasicMaterial, Mesh, PlaneBufferGeometry } from 'in-map/3DLibProvider';
import { removeSceneObject } from 'in-map/stores/sceneStore';

export default class GroundPlane {
  constructor(size) {
    this.size = size;

    const geo = new PlaneBufferGeometry(size, size, 1, 1);
    const mat = new MeshBasicMaterial({
      transparent: true,
      depthWrite: false
    });

    const ground = (this.ground = new Mesh(geo, mat));
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    ground.rotation.x = (-90 * Math.PI) / 180;
    ground.position.y = -0.02;

    // set static
    ground.matrixAutoUpdate = false;
    ground.rotationAutoUpdate = false;
    ground.updateMatrix();
  }

  getCollisionMesh() {
    return this.ground;
  }

  setColor(color) {
    this.ground.material.color = color;
  }

  dispose() {
    // remove this ground from the parents scene
    removeSceneObject(this.ground);

    this.ground.material.dispose();
    this.ground.geometry.dispose();
    this.ground = null;
  }
}
