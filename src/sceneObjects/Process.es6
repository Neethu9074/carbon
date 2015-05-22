'use strict';

import THREE from 'three';

import SceneObject from './SceneObject';
import colors from '../colors';

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
const cubeGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}


export default class Process extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.id = Math.random();
    this.scene = this.getScene();
    this.snapshot = snapshot;
    this.layerIndex = 0; //see this.setLayerIndex

    this.render();

    const parentPos = parent.getPosition();
    this.setPosition(parentPos.x, parentPos.y, parentPos.z);
  }

  registerEvents() {
    this.addSubscription(
      this.on('endUpdate', this.update.bind(this))
    );
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry);
    this.cube.matrixAutoUpdate = false;

    //set this flag to add this obj to octree and not to scene!
    //this.cube.useOnlyForCollisionDetection = true;

    //this.addSceneObject(this.cube);
    this.addToGlobalGeometry();
  }

  addToGlobalGeometry() {
    //add fragment to global geometry
    this.scene.cubeFactory.addFragment({
      id: this.id,
      pos: this.cube.position.clone().add(cubePosition),
      dim: this.cube.scale.clone().multiplyScalar(0.95),
      layerIndex: this.layerIndex
    });
  }

  removeFromGlobalGeometry() {
    this.scene.cubeFactory.removeFragment(this.id);
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);
    this.cube.position.set(x, y, z);

    this.refreshMesh();
  }

  setHeight(height) {
    this.cube.scale.y = height;

    this.refreshMesh();
  }

  //this value is used to store the information of the layer of this process
  // -----   layer 3
  // -----   layer 2
  // -----   layer 1
  // -----   layer 0 (bottom layer)
  setLayerIndex(index) {
    this.layerIndex = index;
  }

  refreshMesh() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  update(data) {
    if(!data.scene.renderHtmlStuff) {
      return;
    }

    //if the host is near enough or is in the view frustum
    if(data.scene.objectIsVisible(this.cube)) {
      this.cube.material.visible = true;
    } else {
      this.cube.material.visible = false;
    }
  }

  dispose() {
    super.dispose();

    this.scene = null;
    this.snapshot = null;
  }
}
