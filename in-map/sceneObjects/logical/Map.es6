import FadeByDistanceSingleMeshFactory from 'in-map/singleMeshFactories/FadeByDistanceSingleMeshFactory';
import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import {CONTROL_PRESETS, setControls} from 'in-components/Controls/stores/controlsStore';
import LineSingleMeshFactory from 'in-map/singleMeshFactories/LineSingleMeshFactory';
import IconSingleMeshFactory from 'in-map/singleMeshFactories/IconSingleMeshFactory';
import createCameraController from 'in-map/misc/logical/CameraController';
import {addFactory, getFactory} from 'in-map/stores/factoriesStore';
import {requestRendering} from 'in-map/stores/renderingStore';
import GroundPlane from 'in-map/misc/logical/GroundPlane';
import createLayouter from 'in-map/misc/logical/Layouter';
import BaseMap from 'in-map/sceneObjects/common/Map';


export default class Map extends BaseMap {

  constructor(params) {
    super(params);

    setControls(CONTROL_PRESETS.LOGICAL);
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

    setControls(null);
  }
}
