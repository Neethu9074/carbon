import THREE from 'three';

import Component from 'in-map/src/components/common/Component/Component';


export default class ScreenPositionComponent extends Component {
  constructor({sceneObject, id}) {
    super(sceneObject, id);

    this.scene = sceneObject.scene;
    this.screenPositionAnchor = new THREE.Vector3();
    this.wasInView = false;
    this.screenPosition = {x: 0, y: 0};
    this.screenPositionChangedKey = 'screenPositionChanged' + id;
    this.isVisibleChangedKey = 'isVisibleChanged' + id;

    // send initial signal
    this.emit(this.isVisibleChangedKey, false);

    this.initialized();
  }

  set3DPositionToProject(x, y, z) {
    this.screenPositionAnchor.set(x, y, z);
  }

  updateScreenPosition(force = false) {
    if (!this.camera) {
      this.camera = this.scene.mapHandler.getCurrentCamera();
      // double check for lazy camera
      if (!this.camera) {
        return;
      }
    }

    const camera = this.camera;
    const scene = this.scene;
    const width = scene.width;
    const height = scene.height;

    const screenPosition = this.screenPositionAnchor
      .clone()
      .applyProjection(camera.projection);

    screenPosition.x = (screenPosition.x + 1) / 2 * width;
    screenPosition.y = -(screenPosition.y - 1) / 2 * height;

    if (force || (this.screenPosition.x !== screenPosition.x || this.screenPosition.y !== screenPosition.y)) {
      this.screenPosition.x = screenPosition.x;
      this.screenPosition.y = screenPosition.y;

      this.needsUpdate = true;

      // force update, so this component gets updated in realtime
      this.handleComponentTimeEvent();
    }
  }

  update() {
    const isInView = this.isInView();
    if (isInView) {
      this.emit(this.screenPositionChangedKey, this.screenPosition);
    }

    if (isInView && !this.wasInView) {
      this.emit(this.isVisibleChangedKey, true);
    } else if (!isInView && this.wasInView) {
      this.emit(this.isVisibleChangedKey, false);
    }

    this.wasInView = isInView;
    this.needsUpdate = false;
  }

  isInView() {
    const screenPos = this.screenPosition;
    const scene = this.scene;

    return (screenPos.x > 0 && screenPos.x <= scene.width &&
            screenPos.y > 0 && screenPos.y <= scene.height);
  }

  dispose() {
    super.dispose();

    this.screenPositionChangedKey = null;
    this.screenPositionAnchor = null;
    this.isVisibleChangedKey = null;
    this.screenPosition = null;
    this.isInView = null;
    this.camera = null;
    this.scene = null;
  }
}
