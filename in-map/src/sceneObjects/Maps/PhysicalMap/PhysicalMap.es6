import MouseCameraController from '../../../controls/MouseCameraController';
import BaseMap from '../BaseMap';


export default class PhysicalMap extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'PhysicalMap'});
  }

  getController(canvas) {
    return new MouseCameraController({
      scene: this.scene,
      map: this,
      canvas
    });
  }

  dispose() {
    super.dispose();
  }
}
