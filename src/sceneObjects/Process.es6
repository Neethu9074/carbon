'use strict';

import THREE from 'three';

import SceneObject from './SceneObject';
import colors from '../colors';

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubeGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}
//const cubeMaterial = new THREE.MeshBasicMaterial();//


export default class Process extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.scene = this.getScene();
    this.snapshot = snapshot;

    this.render();
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

    this.addSceneObject(this.cube);
  }

  setPosition(position) {
    super.setPosition(position);
    this.cube.position.copy(position);

    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();
  }

  setHeight(height) {
    this.cube.scale.y = height;

    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();
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
