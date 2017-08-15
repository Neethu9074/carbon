import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import FadeByDistanceSingleMeshFactory from 'in-map/singleMeshFactories/FadeByDistanceSingleMeshFactory';
import { CONTROL_PRESETS, setControls } from 'in-components/MapOverlayControls/stores/controlsStore';
import { selectedSnapshotIdForHighlightingInMap$ } from 'in-map/stores/selectedMapSceneObjectStore';
import BasicSingleMeshFactory from 'in-map/singleMeshFactories/BasicSingleMeshFactory';
import LineSingleMeshFactory from 'in-map/singleMeshFactories/LineSingleMeshFactory';
import IconSingleMeshFactory from 'in-map/singleMeshFactories/IconSingleMeshFactory';
import createCameraController from 'in-map/misc/physical/CameraController';
import { addFactory, getFactory } from 'in-map/stores/factoriesStore';
import { requestRendering } from 'in-map/stores/renderingStore';
import GroundPlane from 'in-map/misc/physical/GroundPlane';
import createLayouter from 'in-map/misc/physical/Layouter';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { eventBus } from 'in-map/services/eventBus';
import { canvas$ } from 'in-map/stores/indexStore';

export default class Map extends SceneObject {
  constructor(params) {
    super(params);

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.scene = params.scene;

    setControls(CONTROL_PRESETS.PHYSICAL);
  }

  init() {
    super.init();

    this.groundPlane = this.createGroundPlane();

    this.layouter = createLayouter();

    addFactory('nodes', new FadeByDistanceSingleMeshFactory({ renderOrder: 3 }));
    addFactory('solid_layer', new FadeByDistanceSingleMeshFactory({ renderOrder: 2 }));
    addFactory('solid', new FadeByDistanceSingleMeshFactory({ renderOrder: 3 }));
    addFactory('highlighting', new LineSingleMeshFactory({ useSceneObjectColors: false }));
    addFactory('connections', new LineSingleMeshFactory());
    addFactory('layer', new BasicSingleMeshFactory({ renderOrder: 2 }));
    addFactory('lines', new LineSingleMeshFactory());
    addFactory('icons', new IconSingleMeshFactory({ useSceneObjectColors: false }));
  }

  initEvents() {
    super.initEvents();

    const selectedSnapshotIdForHighlightingInMapChangedCallback = this.selectedSnapshotIdForHighlightingInMapChanged.bind(
      this
    );
    this.addSubscription(
      selectedSnapshotIdForHighlightingInMap$.subscribe(selectedSnapshotIdForHighlightingInMapChangedCallback)
    );

    this.addSubscriptions([
      canvas$.once(canvas => {
        if (canvas) {
          CameraControllerServiceLocator.provide(this.createController()(canvas, this));
        } else {
          CameraControllerServiceLocator.provide(null);
        }
      }),
      eventBus.on('update').subscribe(CameraControllerServiceLocator.update)
    ]);
  }

  selectedSnapshotIdForHighlightingInMapChanged(selectedId) {
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
