/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { width, height } from 'in-map/stores/indexStore';
import { eventBus } from 'in-map/services/eventBus';
import { ZERO } from 'in-map/misc/fixedVectors';

const IS_VISIBLE_CHANGED_KEY = 'isVisibleChanged';
const SCREEN_POSITION_CHANGED_KEY = 'screenPositionChanged';

export default class ScreenPositionComponent extends SceneObjectComponent {
  constructor(sceneObject, get3DPositionToProject) {
    super(sceneObject, '_screenPosition');

    this.get3DPositionToProjectCallback = get3DPositionToProject || this.identity;

    this.screenPositionAnchor = ZERO.clone();
    this.screenPosition = { x: 0, y: 0, w: 0, h: 0 };
    this.wasInView = false;
    this.isVisibleChangedKey = IS_VISIBLE_CHANGED_KEY + sceneObject.id;
    this.positionChangedKey = SCREEN_POSITION_CHANGED_KEY + sceneObject.id;

    // send initial signal
    this.emitToClient(this.isVisibleChangedKey, this.wasInView);
  }

  identity(position) {
    return position;
  }

  initEvents() {
    super.initEvents();

    const eventEmitter = this.sceneObject.eventEmitter;
    const transformationChangedCallback = this.transformationChanged.bind(this);
    const willRenderCallback = this.willRender.bind(this);

    this.addSubscriptions([
      eventBus.on('willRenderObject').subscribe(willRenderCallback),
      eventEmitter.on('transformationChanged').subscribe(transformationChangedCallback)
    ]);
  }

  transformationChanged(transform) {
    this.set3DPositionToProject(this.get3DPositionToProjectCallback(transform.position, transform.scale));
  }

  willRender() {
    this.updateScreenPosition();
  }

  set3DPositionToProject(pos) {
    this.screenPositionAnchor.copy(pos);
  }

  setWidthInPx(w) {
    this.screenPosition.w = w;
  }

  setHeightInPx(h) {
    this.screenPosition.h = h;
  }

  updateScreenPosition() {
    const renderableCamera = CameraControllerServiceLocator.getRenderableCamera();
    if (!renderableCamera) {
      return;
    }

    const screenPosition = this.screenPositionAnchor.clone().applyMatrix4(renderableCamera.projection);

    screenPosition.x = (((screenPosition.x + 1) / 2) * width) | 0;
    screenPosition.y = ((-(screenPosition.y - 1) / 2) * height) | 0;

    if (this.screenPosition.x !== screenPosition.x || this.screenPosition.y !== screenPosition.y) {
      this.screenPosition.x = screenPosition.x;
      this.screenPosition.y = screenPosition.y;

      this.update();
    }
  }

  update() {
    const isInView = this.isInView();
    if (isInView) {
      this.sceneObject.eventEmitter.emit(this.positionChangedKey, this.screenPosition);
    }

    if (isInView && !this.wasInView) {
      this.emitToClient(this.isVisibleChangedKey, true);
    } else if (!isInView && this.wasInView) {
      this.emitToClient(this.isVisibleChangedKey, false);
    }

    this.wasInView = isInView;
  }

  isInView() {
    const screenPos = this.screenPosition;
    const objectWidthInPx = screenPos.w * 1.1;
    const objectHeightInPx = screenPos.h * 1.1;
    return (
      screenPos.x + objectWidthInPx > 0 &&
      screenPos.x - objectWidthInPx <= width &&
      screenPos.y + objectHeightInPx > 0 &&
      screenPos.y <= height
    );
  }

  dispose() {
    super.dispose();

    this.screenPositionAnchor = null;
    this.screenPosition = null;
    this.isInView = null;
  }
}
