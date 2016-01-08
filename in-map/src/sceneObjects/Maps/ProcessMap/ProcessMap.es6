import MouseCameraController from '../../../controls/MouseCameraController';
import BaseMap from '../BaseMap';


export default class ProcessMap extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});
  }

  getController(canvas) {
    return new MouseCameraController({
      scene: this.scene,
      map: this,
      canvas
    });
  }

  getGroundTexture() {
    return undefined;
  }

  onZoom() {}

  dispose() {
    super.dispose();
  }
}
