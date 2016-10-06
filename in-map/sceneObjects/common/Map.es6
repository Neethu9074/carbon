import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import createNullService from 'in-map/misc/serviceLocator/cameraController/CameraControllerNullService';
import createWebVRController from 'in-map/misc/common/cameraController/WebVRCameraController';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {isWebVRActive} from 'in-map/stores/webVRStore';
import {eventBus} from 'in-map/services/eventBus';
import {canvas$} from 'in-map/stores/indexStore';


export default class Map extends SceneObject {

  constructor(params) {
    super(params);

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.scene = params.scene;
  }

  init() {
    super.init();

    this.groundPlane = this.createGroundPlane();
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      canvas$.once(canvas => {
        if (canvas) {
          CameraControllerServiceLocator.provide(isWebVRActive
            ? createWebVRController(canvas)
            : this.createController()(canvas, this));
        } else {
          CameraControllerServiceLocator.provide(createNullService());
        }
      }),

      eventBus.on('update').subscribe(CameraControllerServiceLocator.update)
    ]);
  }

  dispose() {
    super.dispose();

    CameraControllerServiceLocator.provide(createNullService());

    this.groundPlane.dispose();
    this.groundPlane = null;

    this.scene = null;
    this.size = null;
  }
}
