import FadeByDistanceSingleMeshFactory from 'in-map/singleMeshFactories/FadeByDistanceSingleMeshFactory';
import BasicSingleMeshFactory from 'in-map/singleMeshFactories/BasicSingleMeshFactory';
import LineSingleMeshFactory from 'in-map/singleMeshFactories/LineSingleMeshFactory';
import IconSingleMeshFactory from 'in-map/singleMeshFactories/IconSingleMeshFactory';
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

    addFactory('nodes', new FadeByDistanceSingleMeshFactory(3));
    addFactory('highlighting', new LineSingleMeshFactory(2));
    addFactory('connections', new LineSingleMeshFactory());
    addFactory('metrics', new BasicSingleMeshFactory(2));
    addFactory('layer', new BasicSingleMeshFactory(2));
    addFactory('lines', new LineSingleMeshFactory());
    addFactory('icons', new IconSingleMeshFactory());
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
