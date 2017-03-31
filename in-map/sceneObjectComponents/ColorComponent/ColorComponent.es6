import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { hexToRGBNormalized } from 'in-services/formatters/color';

export default class ColorComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_color');

    // pure white as default
    this.color = {
      r: 1,
      g: 1,
      b: 1
    };
  }

  setHex(hex) {
    this.setColor(hexToRGBNormalized(hex));
  }

  setColor(color) {
    this.setRGB(color.r, color.g, color.b);
  }

  setRGB(r, g, b) {
    const color = this.color;
    if (color.r === r && color.g === g && color.b === b) {
      return;
    }

    color.r = r;
    color.g = g;
    color.b = b;
    this.emitToClient('colorChanged', color);
  }

  getColor() {
    return this.color;
  }

  dispose() {
    super.dispose();

    this.color = null;
  }
}
