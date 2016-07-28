import CameraController from 'in-map/misc/physical/CameraController';
import BaseMap from 'in-map/sceneObjects/common/Map';


export default class Map extends BaseMap {

  constructor(params) {
    super(params);

    this.cameraController = undefined;
  }

  createController(scene) {
    return new CameraController(scene);
  }

  createGroundPlane() {

  }

  dispose() {
    super.dispose();
  }
}
