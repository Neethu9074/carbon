import { addSceneObject, removeSceneObject } from 'in-map/stores/sceneStore';
import { hexToRGBNormalized } from 'in-services/formatters/color';
import BaseGroundPlane from 'in-map/misc/common/GroundPlane';

export default class GroundPlane extends BaseGroundPlane {
  constructor() {
    super(1000);

    const color = hexToRGBNormalized('#445b63');
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
