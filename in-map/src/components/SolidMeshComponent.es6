'use strict';

import Component from './Component';

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
    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.setupFragment();

    this.initialized();
  }

  onInitialEnter() {
    this.getFactory().addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.getFactory().removeFragment(this.getID());
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
    this.setupFragment();

    if(this.isActive()) {
      this.getFactory().addFragment(this.fragment);
    }

    this.needsUpdate = false;
  }

  setupFragment() {
    const pcm = this.geometryProvider;
    const scm = pcm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;

    pcm.position = {x: pos.x - 0.5, y: pos.y, z: pos.z + 0.5};
    scm.scale = {x: 1, y: scale.y, z: 1};
  }

  getID() {
    return this.sceneObject.id + '_solidMesh';
  }

  getFactory() {
    return this.sceneObject.scene.highlightingSingleMeshFactory;
  }

  dispose() {
    super.dispose();

    this.getFactory().removeFragment(this.getID());
  }
}
