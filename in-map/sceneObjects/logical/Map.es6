import FadeByDistanceSingleMeshFactory from 'in-map/singleMeshFactories/FadeByDistanceSingleMeshFactory';
import LineSingleMeshFactory from 'in-map/singleMeshFactories/LineSingleMeshFactory';
import IconSingleMeshFactory from 'in-map/singleMeshFactories/IconSingleMeshFactory';
import {particlesAreActive$} from 'in-map/stores/logical/particlesStore';
import CameraController from 'in-map/misc/logical/CameraController';
import {addFactory, getFactory} from 'in-map/stores/factoriesStore';
import GroundPlane from 'in-map/misc/logical/GroundPlane';
import createLayouter from 'in-map/misc/logical/Layouter';
import BaseMap from 'in-map/sceneObjects/common/Map';


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
    addFactory('lines', new LineSingleMeshFactory());
    addFactory('icons', new IconSingleMeshFactory());
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      particlesAreActive$.subscribe(particlesAreActive => {
        const connectionFactory = getFactory('connections');
        if (connectionFactory) {
          connectionFactory.material.transparent = particlesAreActive;
          connectionFactory.material.opacity = 0.25;
        }
      })
    );
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
