'use strict';

import THREE from 'three';

export default class SceneObject {

  constructor({parent, pos = new THREE.Vector3()}) {
    this.position = pos.clone();
    this.parent = parent;
    this.subscriptions = [];
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
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

  //hides the visual representation and pauses all live data streaming
  hide() {

  }

  //show the visual representation and continues all live data streaming
  show() {

  }

  dispose() {
    this.disposeSubscriptions();

    this.position = null;

    if(this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = null;
  }

  disposeSubscriptions() {
    this.subscriptions.forEach(subscription => {
      subscription.dispose();
      subscription = null;
    });
    this.subscriptions = [];
  }

  removeChild() {}
}
