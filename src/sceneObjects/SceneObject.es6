'use strict';

import THREE from 'three';

export default class SceneObject {

  constructor({parent, pos = new THREE.Vector3()}) {
    this.position = pos.clone();
    this.parent = parent;
    this.subscriptions = [];
  }

  setPosition(newPos) {
    this.position.copy(newPos);
  }

  getPosition() {
    return this.position;
  }

  addSceneObject(obj) {
    this.parent.addSceneObject(obj);
  }

  removeSceneObject(obj) {
    this.parent.removeSceneObject(obj);
  }

  addSubscription(subscription) {
    this.subscriptions.push(subscription);
  }

  getScene() {
    return this.parent.getScene();
  }

  dispose() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];

    this.position = null;
    this.parent = null;
  }

  getHtmlContainer() {
    return this.parent.getHtmlContainer();
  }

  on(event, cb) {
    return this.parent.on(event, cb);
  }

  //each object can tell that the scene should be redrawn
  renderScene() {
    this.parent.renderScene();
  }
}
