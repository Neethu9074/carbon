'use strict';

import Component from './Component';
// import THREE from 'three';

import CCP from '../SingleMeshFactory/ContentProvider/CubeContentProvider';
import PCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';


export default class SolidMeshComponent extends Component{
  constructor({sceneObject}) {
    super(sceneObject);

    this.geometryProvider = new PCM({
      contentProvider: new SCM({
        contentProvider: new CCP()
      })
    });
    this.fragment = {
      id: this.getID(),
      contentProvider: this.geometryProvider
    };

    this.scaleToSet = {x: 1, y: 1, z: 1};
    this.positionToSet = {x: 0, y: 0, z: 0};

    this.initialized();
  }

  onInitialEnter() {
    this.sceneObject.scene.highlightingSingleMeshFactory.addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.sceneObject.scene.highlightingSingleMeshFactory.removeFragment(this.getID());
  }


  positionChanged(x, y, z) {
    const pos = this.positionToSet;
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    this.positionToSet = {x, y, z};
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if(scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.scaleToSet = {x, y, z};
    this.needsUpdate = true;
  }

  update30Fps() {
    const pcm = this.geometryProvider;
    const scm = pcm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;

    pcm.position = {x: pos.x - 0.5, y: pos.y, z: pos.z + 0.5};
    scm.scale = {x: 1, y: scale.y, z: 1};

    if(this.isActive()) {
      this.sceneObject.scene.highlightingSingleMeshFactory.addFragment(this.fragment);
    }

    this.needsUpdate = false;
  }

  getID() {
    return this.sceneObject.id + '_h';
  }
}
