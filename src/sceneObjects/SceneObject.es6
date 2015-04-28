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
  }

  getHtmlContainer() {
    return this.parent.getHtmlContainer();
  }

  on(event) {
    return this.parent.on(event);
  }
}
