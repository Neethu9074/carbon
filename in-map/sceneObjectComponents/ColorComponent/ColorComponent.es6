import THREE from 'three';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import {requestRendering} from 'in-map/stores/renderingStore';


export default class ColorComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_transformation');

    this.color = new THREE.Color(0xffffff);
  }

  setRGB(r, g, b) {
    if (this.color.x === r &&
        this.color.y === g &&
        this.color.z === b) {
      return;
    }

    this.color.setRGB(r, g, b);
    this.emitToClient('colorChangedChanged', this.position);
    requestRendering();
  }

  set(color) {
    this.setRGB(color.r, color.g, color.b);
  }

  getColor() {
    return this.color;
  }

  dispose() {
    super.dispose();

    this.color = null;
  }
}
