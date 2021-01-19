/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import createNullService from 'in-map/misc/serviceLocator/cameraController/CameraControllerNullService';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { debouncedQuery$ } from 'in-stores/search/query';
import { eventBus } from 'in-map/services/eventBus';
import { FACTORY } from 'in-map/misc/TimingConfig';
import { canvas$ } from 'in-map/stores/indexStore';
import { focusId } from 'in-map/services/focus';

export default class Map extends SceneObject {
  constructor(params) {
    super(params);

    // the size of the map in world units (sizeXsize)
    this.size = 1000;
    this.scene = params.scene;
    this.initFocsed = false;
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
          CameraControllerServiceLocator.provide(this.createController()(canvas, this));
        } else {
          CameraControllerServiceLocator.provide(createNullService());
        }
      }),

      eventBus.on('update').subscribe(CameraControllerServiceLocator.update),

      debouncedQuery$.subscribe(focusId)
    ]);
  }

  afterUpdateEntities() {
    if (this.initFocsed) {
      return;
    }
    this.initFocsed = true;

    debouncedQuery$
      .debounce(FACTORY * 2, { leading: false })
      .nextFrame()
      .once(focusId);
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
