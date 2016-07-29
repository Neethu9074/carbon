import FadeByDistanceSingleMeshFactory from 'in-map/singleMeshFactories/FadeByDistanceSingleMeshFactory';
import LineSingleMeshFactory from 'in-map/singleMeshFactories/LineSingleMeshFactory';
import CameraController from 'in-map/misc/physical/CameraController';
import GroundPlane from 'in-map/misc/physical/GroundPlane';
import createLayouter from 'in-map/misc/physical/Layouter';
import BaseMap from 'in-map/sceneObjects/common/Map';
import {addFactory} from 'in-map/misc/Factories';


export default class Map extends BaseMap {

  constructor(params) {
    super(params);

    this.cameraController = undefined;
  }

  init() {
    super.init();

    this.layouter = createLayouter(this);

    addFactory('nodes', new FadeByDistanceSingleMeshFactory());
    addFactory('lines', new LineSingleMeshFactory());
  }

  createController(scene) {
    return new CameraController(scene, this);
  }

  createGroundPlane() {
    return new GroundPlane({
      parent: this,
      size: this.size
    });
  }

  dispose() {
    super.dispose();

    this.layouter.dispose();
  }
}
