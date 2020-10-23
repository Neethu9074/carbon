import { combineLatest } from 'reactive-observables';

import { getServiceLocators } from 'in-applications/FlowMap/serviceLocator/serviceLocator';
import { DISTANCE_BETWEEN_NODES_X } from 'in-applications/FlowMap/misc/layouting/config';
import CameraController from 'in-applications/FlowMap/misc/CameraController';
import Camera from 'in-applications/FlowMap/sceneObjects/OrthographicCamera';
import Renderer from 'in-applications/FlowMap/sceneObjects/Renderer';
import TimeTracker from 'in-applications/FlowMap/misc/TimeTracker';
import { Scene } from 'in-map/3DLibProvider';
import Subscriber from 'in-map/misc/Subscriber';

export default class MainScene {
  constructor(serviceLocatorUid, canvas, overlayDomElement) {
    this.isDisposed = false;
    this.serviceLocatorUid = serviceLocatorUid;
    this.overlayDomElement = overlayDomElement;
    this.canvas = canvas;
    this.shouldRenderScene = true;
    this.handleAnimationFrames = this.handleAnimationFrames.bind(this);
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
    this.subscriber = new Subscriber();
    this.subscriber.addSubscriptions([
      getServiceLocators(this.serviceLocatorUid)
        .eventBusServiceLocator.on('resize')
        .subscribe(dimensions => this.setSize(dimensions.width, dimensions.height)),

      combineLatest([
        getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.on('resize'),
        getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.on('cameraUpdate')
      ])
        .map(([windowDimensions, camera]) => {
          const worldUnits = {
            pixelsPer3DUnit: windowDimensions.width / camera.getCameraSize(),
            unitsPerPixel: camera.getCameraSize() / windowDimensions.width
          };

          worldUnits.targetNodeSizeInPx = this.calculateTargetNodeSizeInPx(
            camera.getCameraSize(),
            windowDimensions.width
          );

          return worldUnits;
        })
        .subscribe(units => getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit('worldUnits', units))
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
    getServiceLocators(this.serviceLocatorUid).eventBusServiceLocator.emit('update', dt);

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

    if (!this.initialPxUnitRation) {
      this.initialPxUnitRation = this.camera.getCameraSize() / width;
      this.initialNodeSizeInPx = this.calculateTargetNodeSizeInPx(this.camera.getCameraSize(), width);
    }

    // refresh the rendering result
    this.requestRendering();
  }

  calculateTargetNodeSizeInPx(cameraSize, width) {
    const pixelsPer3DUnit = width / cameraSize;

    const distanceBetweenNodesInPx = DISTANCE_BETWEEN_NODES_X * pixelsPer3DUnit;
    const wantedGapInPx = 3 * pixelsPer3DUnit;
    return distanceBetweenNodesInPx - wantedGapInPx;
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
