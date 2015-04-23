'use strict';

import THREE from 'three.js';

export default class SceneObject {

  constructor({parent, pos = new THREE.Vector3()}) {
    this.position = pos.clone();
    this.parent = parent;
  }

	setLocalPosition(newPos) {
		this.position.copy(newPos);
	}

  getLocalPosition() {
		return this.position;
	}

  getWorldPosition() {
    if(this.parent) {
      return this.getLocalPosition()
        .clone()
        .add(this.parent.getWorldPosition());
    } else {
      return this.getLocalPosition();
    }
  }

  addSceneObject(obj) {
    this.parent.addSceneObject(obj);
  }

  removeSceneObject(obj) {
    this.parent.removeSceneObject(obj);
  }
}
