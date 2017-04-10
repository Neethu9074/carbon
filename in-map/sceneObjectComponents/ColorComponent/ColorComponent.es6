import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { hexToRGBNormalized } from 'in-services/formatters/color';

export default class ColorComponent extends SceneObjectComponent {
  constructor(sceneObject, defaultColor = '#ffffff') {
    super(sceneObject, '_color');

    this.color = defaultColor;
    this.colorAsRGB = null;
  }

  setHex(hex) {
    if (this.color !== hex) {
      this.color = hex;
      this.colorAsRGB = null;
      this.emitToClient('colorChanged', hex);
    }
  }

  getColor() {
    return this.color;
  }

  getColorAsRGB() {
    // lazy generate rgb colors
    if (!this.colorAsRGB) {
      this.colorAsRGB = hexToRGBNormalized(this.color);
    }
    return this.colorAsRGB;
  }

  dispose() {
    super.dispose();

    this.color = null;
  }
}
