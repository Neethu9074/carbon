/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { getServiceLocators } from 'in-applications/ApplicationMap/serviceLocator/serviceLocator';
import CameraController from 'in-applications/ApplicationMap/misc/CameraController';
import Camera from 'in-applications/ApplicationMap/sceneObjects/OrthographicCamera';
import Renderer from 'in-applications/ApplicationMap/sceneObjects/Renderer';
import TimeTracker from 'in-applications/ApplicationMap/misc/TimeTracker';
import Subscriber from 'in-map/misc/Subscriber';
import { Scene } from 'in-map/3DLibProvider';

export default class _Scene {
  constructor(serviceLocatorUid, canvas, overlayDomElement) {
    this.isDisposed = false;
    this.serviceLocatorUid = serviceLocatorUid;
    this.overlayDomElement = overlayDomElement;
    this.canvas = canvas;
    this.shouldRenderScene = true;
    this.handleAnimationFrames = this.handleAnimationFrames.bind(this);
    this.isHoveringConnection = false;
  }

  init() {
    this.timeTracker = new TimeTracker();
    this.scene = new Scene();
    this.renderTarget = new Renderer(this.canvas);
    this.camera = new Camera(this.serviceLocatorUid);
    this.cameraController = new CameraController(this.serviceLocatorUid, this.camera, this.overlayDomElement);

    this.initSubscriptions();
  }

  initSubscriptions() {
    const eventBusServiceLocator = getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator;

    this.subscriber = new Subscriber();
    this.subscriber.addSubscriptions([
      eventBusServiceLocator
        .on(SIGNALS.RESIZE)
        .subscribe(dimensions => this.setSize(dimensions.width, dimensions.height)),

      combineLatest([eventBusServiceLocator.on(SIGNALS.RESIZE), eventBusServiceLocator.on(SIGNALS.CAMERA_UPDATE)])
        .map(([{ width }, camera]) => {
          const worldUnits = {
            unitsPerPixel: (camera.camera.right * 2) / width,
            aspectRatio: camera.aspect
          };

          const cameraSize = camera.getCameraSize();
          if (camera.aspect > 1) {
            worldUnits.targetNodeSizeInRelationToInitSize = camera.initialCameraSize / (cameraSize * camera.aspect);
          } else {
            worldUnits.targetNodeSizeInRelationToInitSize = camera.initialCameraSize / cameraSize;
          }

          return worldUnits;
        })
        .subscribe(units => eventBusServiceLocator.emit(SIGNALS.WORLD_UNITS, units))
    ]);
  }

  startRendering() {
    this.handleAnimationFrames(0);
  }

  requestRendering() {
    this.shouldRenderScene = true;
  }

  handleAnimationFrames(highResTimestamp) {
    // break the browser update routine
    if (this.isDisposed) {
      return;
    }

    // recall this to keep the update loop
    requestAnimationFrame(this.handleAnimationFrames);

    this.update(highResTimestamp);
  }

  update(highResTimestamp) {
    this.timeTracker.update(highResTimestamp);

    const dt = this.timeTracker.deltaTime;
    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit(SIGNALS.UPDATE, dt);

    if (!this.shouldRenderScene) {
      return;
    }
    this.shouldRenderScene = false;

    this.renderTarget.render(this.scene, this.camera);
  }

  addSceneObject(object) {
    this.scene.add(object);
  }

  removeSceneObject(object) {
    this.scene.remove(object);
  }

  setSize(width, height) {
    this.renderTarget.setSize(width, height);

    this.camera.setSize(width, height);
    this.camera.update();

    // refresh the rendering result
    this.requestRendering();
  }

  disposeSubscriptions() {
    this.subscriber.dispose();
    this.subscriber = null;
  }

  disposeCameraController() {
    this.cameraController.dispose();
    this.cameraController = null;
  }

  dispose() {
    // break the browser update routine
    this.isDisposed = true;

    this.disposeSubscriptions();
    this.disposeCameraController();

    this.overlayDomElement = null;
    this.renderTarget = null;
    this.canvas = null;
  }
}
