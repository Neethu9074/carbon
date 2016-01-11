import THREE from 'three';

import MouseCameraController from '../../../controls/MouseCameraController';
import GroundPlane from '../../GroundPlanes/GroundPlane';
import BaseMap from '../BaseMap';


export default class ProcessMap extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});

    this.groundPlane.setColor(new THREE.Color(0x445b63));
  }

  getGroundPlane() {
    return new GroundPlane({
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

  getGroundTexture() {
    return undefined;
  }

  onZoom() {}

  dispose() {
    super.dispose();
  }
}
