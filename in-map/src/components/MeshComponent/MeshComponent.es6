import THREE from 'three';

import {theme} from 'in-services/theme';

import Component from '../Component';


export default class MeshComponent extends Component {
  constructor({sceneObject, contentProvider, id, factory}) {
    super(sceneObject);

    this.id = id;
    this.contentProvider = contentProvider;
    this.factory = factory;
    this.fragment = {id: this.id, contentProvider};

    const color = new THREE.Color(theme.map.colors.default);
    this.colorToSet = {r: color.r + 0.2, g: color.g + 0.2, b: color.b + 0.2};
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
    this.changeXyzOf(this.positionToSet, x, y, z);
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if(scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.changeXyzOf(this.scaleToSet, x, y, z);
    this.needsUpdate = true;
  }

  changeXyzOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  colorChanged(r, g, b) {
    const color = this.colorToSet;
    if(color.r === r && color.g === g && color.b === b) {
      return;
    }

    this.colorToSet = {r, g, b};
    this.needsUpdate = true;
  }

  update() {
    this.needsUpdate = false;
    this.setupFragment();

    if(this.isActive()) {
      this.factory.removeFragment(this.id);
      this.factory.addFragment(this.fragment);
    }
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
    scm.scale = {x: scale.x, y: scale.y, z: scale.z};
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);
  }
}
