'use strict';

import THREE from 'three';

import React from 'react';

import SceneObject from '../SceneObject';
import colors from '../../colors';
import StickyNote from './StickyNote';

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

    this.id = snapshot.get('steadyId');
    this.scene = this.getScene();
    this.snapshot = snapshot;
    this.layerIndex = 0; //see this.setLayerIndex

    this.render();
    this.addStickyNote();

    const parentPos = parent.getPosition();
    this.setPosition(parentPos.x, parentPos.y, parentPos.z);
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry);
    this.cube.matrixAutoUpdate = false;

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

  addStickyNote() {
    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainerStyle = this.stickyNoteContainer.style;
    this.stickyNoteContainer.classList.add('in-sticky-note-process');
    this.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.stickyNoteEndPosWorld = new THREE.Vector3();
    this.calcStickyNodeWorldPos();

    this.renderStickyNote();
  }

  calcStickyNodeWorldPos() {
    const pos = this.parent.getPosition();
    const worldPos = this.stickyNoteEndPosWorld;
    worldPos.set(pos.x, pos.y + this.parent.cube.scale.y, pos.z + 1);
  }

  renderStickyNote(height) {
    const numProcesses = this.parent.processes.length;

    React.render(
      <StickyNote height={height} numProcesses={numProcesses} />,
      this.stickyNoteContainer
    );
  }

  removeFromGlobalGeometry() {
    this.scene.cubeFactory.removeFragment(this.id);
  }

  updateStickyNotePosition() {
    if(this.layerIndex !== 0) {
      return;
    }

    const scene = this.getScene();
    const pos = this.stickyNoteEndPosWorld.clone();
    pos.applyMatrix4(scene.camera.projection);

    const x = ((pos.x + 1) * scene.width / 2) | 0;
    const y = ((-pos.y + 1) * scene.height / 2) | 0;
    const translate = `translate3d(${x}px,${y}px,0)`;

    this.stickyNoteContainerStyle.transform = translate;
    this.stickyNoteContainerStyle['-webkit-transform'] = translate;


    const posBottom = this.stickyNoteEndPosWorld.clone();
    posBottom.y = 0;
    posBottom.applyMatrix4(scene.camera.projection);

    const yBottom = ((-posBottom.y + 1) * scene.height / 2) | 0;
    this.renderStickyNote(yBottom - y);
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

    if(index > 0) {
      this.stickyNoteContainerStyle.display = 'none';
    } else {
      this.stickyNoteContainerStyle.display = '';
    }
  }

  refreshMesh() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.calcStickyNodeWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  dispose() {
    super.dispose();

    this.scene = null;
    this.snapshot = null;
  }
}
