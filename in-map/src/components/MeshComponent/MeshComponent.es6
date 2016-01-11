import THREE from 'three';

import {theme} from 'in-services/theme';

import Component from '../Component';
import XYZ from '../XYZ';
import RGB from '../RGB';


export default class MeshComponent extends Component {
  constructor({sceneObject, contentProvider, factory}) {
    super(sceneObject, '_mesh');

    this.factory = factory;
    this.contentProvider = contentProvider;
    this.fragment = {id: this.id, contentProvider};

    const color = new THREE.Color(theme.map.colors.default);
    this.colorToSet = new RGB(color.r, color.g, color.b);
    this.positionToSet = new XYZ(-1000, 0, 0);
    this.scaleToSet = new XYZ(1, 1, 1);

    this.updateContentProvider();
    this.initialized();
  }

  onInitialEnter() {
    this.factory.addFragment(this.fragment);
  }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
  }


  positionChanged(x, y, z) {
    this.positionToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if (scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.scaleToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  colorChanged(r, g, b) {
    const color = this.colorToSet;
    if (color.r === r && color.g === g && color.b === b) {
      return;
    }

    this.colorToSet.set(r, g, b);
    this.needsUpdate = true;
  }

  update() {
    this.needsUpdate = false;
    this.updateContentProvider();

    if (this.isActive()) {
      this.factory.addFragment(this.fragment);
    }
  }

  updateContentProvider() {
    const cmcm = this.contentProvider;
    const pcm = cmcm.contentProvider;
    const scm = pcm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const color = this.colorToSet;

    this.changeXYZOf(pcm.position, pos.x - 0.5, pos.y, pos.z + 0.5);
    this.changeXYZOf(scm.scale, scale.x, scale.y, scale.z);

    cmcm.color = color;
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);

    this.positionToSet.dispose();
    this.colorToSet.dispose();
    this.scaleToSet.dispose();

    this.contentProvider = null;
    this.positionToSet = null;
    this.colorToSet = null;
    this.scaleToSet = null;
    this.fragment = null;
    this.factory = null;
    this.id = null;
  }
}
