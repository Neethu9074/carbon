import THREE from 'three';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {hexToRGBNormalized} from 'in-services/formatters/color';


export default class ColorComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_color');

    this.color = new THREE.Color(0xffffff);
    this.emitToClient('colorChanged', this.color);
  }

  setHex(hex) {
    this.setColor(hexToRGBNormalized(hex));
  }

  setColor(color) {
    this.setRGB(color.r, color.g, color.b);
  }

  setRGB(r, g, b) {
    if (this.color.r === r &&
        this.color.g === g &&
        this.color.b === b) {
      return;
    }

    this.color.setRGB(r, g, b);
    this.emitToClient('colorChanged', this.color);
  }

  getColor() {
    return this.color;
  }

  dispose() {
    super.dispose();

    this.color = null;
  }
}
