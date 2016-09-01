import FadeByDistanceSingleMeshFactory from 'in-map/singleMeshFactories/FadeByDistanceSingleMeshFactory';
import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import BasicSingleMeshFactory from 'in-map/singleMeshFactories/BasicSingleMeshFactory';
import {CONTENT_TYPES, setContent} from 'in-components/Controls/stores/contentStore';
import LineSingleMeshFactory from 'in-map/singleMeshFactories/LineSingleMeshFactory';
import IconSingleMeshFactory from 'in-map/singleMeshFactories/IconSingleMeshFactory';
import createCameraController from 'in-map/misc/physical/CameraController';
import {addFactory, getFactory} from 'in-map/stores/factoriesStore';
import {requestRendering} from 'in-map/stores/renderingStore';
import GroundPlane from 'in-map/misc/physical/GroundPlane';
import createLayouter from 'in-map/misc/physical/Layouter';
import BaseMap from 'in-map/sceneObjects/common/Map';


export default class Map extends BaseMap {

  constructor(params) {
    super(params);

    this.cameraController = undefined;

    setContent(CONTENT_TYPES.PHYSICAL);
  }

  init() {
    super.init();

    this.layouter = createLayouter();

    addFactory('nodes', new FadeByDistanceSingleMeshFactory({renderOrder: 3}));
    addFactory('solid_layer', new FadeByDistanceSingleMeshFactory({renderOrder: 2}));
    addFactory('solid', new FadeByDistanceSingleMeshFactory({renderOrder: 3}));
    addFactory('highlighting', new LineSingleMeshFactory({useSceneObjectColors: false}));
    addFactory('connections', new LineSingleMeshFactory());
    addFactory('layer', new BasicSingleMeshFactory({renderOrder: 2}));
    addFactory('lines', new LineSingleMeshFactory());
    addFactory('icons', new IconSingleMeshFactory({useSceneObjectColors: false}));
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      selectedSnapshotIdForHighlightingInMap$.subscribe(selectedId => {
        if (selectedId) {
          getFactory('nodes').lockOpacity(0.25);
          getFactory('layer').material.transparent = true;
          getFactory('layer').material.depthWrite = false;
        } else {
          getFactory('nodes').unlockOpacity();
          getFactory('layer').material.transparent = false;
          getFactory('layer').material.depthWrite = true;
        }
        requestRendering();
      })
    );
  }

  createController() {
    return createCameraController;
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

    setContent(null);
  }
}
