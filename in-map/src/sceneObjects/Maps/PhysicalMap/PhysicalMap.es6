import {hexToRGBNormalized} from 'in-services/converters';
import theme from 'in-services/theme';

import MouseCameraController from '../../../controls/MouseCameraController';
import GroundPlaneWithGrid from '../../GroundPlanes/GroundPlaneWithGrid';
import BaseMap from '../BaseMap';


export default class PhysicalMap extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'PhysicalMap'});

    const color = hexToRGBNormalized(theme.map.colors.groundDots);
    this.groundPlane.setColor(color);
  }

  getGroundPlane() {
    return new GroundPlaneWithGrid({
      parent: this,
      size: this.size
    });
  }

  getController(canvas) {
    return new MouseCameraController({
      scene: this.scene,
      map: this,
      canvas
    });
  }

  onZoom(zoomLevel) {
    if (this.groundPlane) {
      this.groundPlane.onZoom(zoomLevel);
    }
  }

  dispose() {
    super.dispose();
  }
}
