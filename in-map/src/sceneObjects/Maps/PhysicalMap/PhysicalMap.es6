import MouseCameraController from '../../../controls/MouseCameraController';
import GroundPlaneWithGrid from '../../GroundPlanes/GroundPlaneWithGrid';
import BaseMap from '../BaseMap';


export default class PhysicalMap extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'PhysicalMap'});
  }

  getGroundPlane() {
    return new GroundPlaneWithGrid({ parent: this, size: this.size });
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
