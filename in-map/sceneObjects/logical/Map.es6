import FadeByDistanceSingleMeshFactory from 'in-map/singleMeshFactories/FadeByDistanceSingleMeshFactory';
import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import LineSingleMeshFactory from 'in-map/singleMeshFactories/LineSingleMeshFactory';
import {CONTENT_TYPES, setContent} from 'in-components/Controls/stores/contentStore';
import IconSingleMeshFactory from 'in-map/singleMeshFactories/IconSingleMeshFactory';
import {particlesAreActive$} from 'in-map/stores/logical/particlesStore';
import createCameraController from 'in-map/misc/logical/CameraController';
import {addFactory, getFactory} from 'in-map/stores/factoriesStore';
import {requestRendering} from 'in-map/stores/renderingStore';
import GroundPlane from 'in-map/misc/logical/GroundPlane';
import createLayouter from 'in-map/misc/logical/Layouter';
import BaseMap from 'in-map/sceneObjects/common/Map';


export default class Map extends BaseMap {

  constructor(params) {
    super(params);

    setContent(CONTENT_TYPES.LOGICAL);
  }

  init() {
    super.init();

    this.layouter = createLayouter();

    addFactory('nodes', new FadeByDistanceSingleMeshFactory({renderOrder: 3}));
    addFactory('solid', new FadeByDistanceSingleMeshFactory({renderOrder: 3}));
    addFactory('highlighting', new LineSingleMeshFactory({useSceneObjectColors: false}));
    addFactory('connections', new LineSingleMeshFactory());
    addFactory('icons', new IconSingleMeshFactory({useSceneObjectColors: false}));
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      particlesAreActive$.subscribe(particlesAreActive => {
        const connectionFactory = getFactory('connections');
        if (connectionFactory) {
          connectionFactory.material.transparent = particlesAreActive;
        }
      }),

      selectedSnapshotIdForHighlightingInMap$.subscribe(selectedId => {
        selectedId
          ? getFactory('nodes').lockOpacity(0.25)
          : getFactory('nodes').unlockOpacity();
        requestRendering();
      })
    ]);
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
