import { addSceneObject, removeSceneObject } from 'in-map/stores/sceneStore';
import { hexToRGBNormalized } from 'in-services/formatters/color';
import BaseGroundPlane from 'in-map/misc/common/GroundPlane';
import { theme } from 'in-services/theme';

export default class GroundPlane extends BaseGroundPlane {
  constructor() {
    super(1000);

    const color = hexToRGBNormalized(theme.map.colors.clearColor);
    this.ground.material.color.setRGB(color.r, color.g, color.b);
    addSceneObject(this.ground);
  }

  dispose() {
    removeSceneObject(this.ground);

    this.ground.material.dispose();
    this.ground.geometry.dispose();
    this.ground = null;
  }
}
