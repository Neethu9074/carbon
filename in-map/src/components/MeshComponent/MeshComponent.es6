'use strict';

import Component from '../Component';


export default class MeshComponent extends Component {
  constructor({sceneObject, contentProvider, id, factory}) {
    super(sceneObject);

    this.id = id;
    this.contentProvider = contentProvider;
    this.factory = factory;
    this.fragment = {id: this.id, contentProvider};

    this.colorToSet = {r: 1, g: 1, b: 1};
    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.scaleToSet = {x: 1, y: 1, z: 1};
    this.setupFragment();

    this.initialized();
  }

  onInitialEnter() {
    this.factory.addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
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

  colorChanged(r, g, b) {
    const color = this.colorToSet;
    if(color.r === r && color.g === g && color.b === b) {
      return;
    }

    this.colorToSet = {r, g, b};
    this.needsUpdate = true;
  }

  update30Fps() {
    this.setupFragment();

    if(this.isActive()) {
      this.factory.addFragment(this.fragment);
    }

    this.needsUpdate = false;
  }

  setupFragment() {
    const cmcm = this.contentProvider;
    const pcm = cmcm.contentProvider;
    const scm = pcm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const color = this.colorToSet;

    cmcm.color = {r: color.r, g: color.g, b: color.b};
    pcm.position = {x: pos.x - 0.5, y: pos.y, z: pos.z + 0.5};
    scm.scale = {x: 1, y: scale.y, z: 1};
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);
  }
}
