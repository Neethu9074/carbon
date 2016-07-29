import THREE from 'three';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import {requestRendering} from 'in-map/stores/renderingStore';


export default class TransformationComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_transformation');

    this.position = new THREE.Vector3(0, 0, 0);
    this.scale = new THREE.Vector3(1, 1, 1);
  }

  setPositionXYZ(x, y, z) {
    if (this.position.x === x &&
        this.position.y === y &&
        this.position.z === z) {
      return;
    }

    this.position.set(x, y, z);
    this.emitToClient('positionChanged', this.position);
    requestRendering();
  }

  setPosition(newPosition) {
    this.setPositionXYZ(newPosition.x, newPosition.y, newPosition.z);
  }

  setScaleXYZ(x, y, z) {
    if (this.scale.x === x &&
        this.scale.y === y &&
        this.scale.z === z) {
        return;
      }

    this.scale.set(x, y, z);
    this.emitToClient('scaleChanged', this.scale);
    requestRendering();
  }

  setScale(newScale) {
    this.setScaleXYZ(newScale.x, newScale.y, newScale.z);
  }

  getPosition() {
    return this.position;
  }

  getScale() {
    return this.scale;
  }

  dispose() {
    super.dispose();

    this.position = null;
    this.scale = null;
  }
}
