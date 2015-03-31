'use strict';

import * as App from '../app';


class SceneObject{
  constructor(ID, pos, dim) {
    this.app = App.getApplication();
    this.ID = ID;
    this.position = pos.clone();
    this.dimension = dim.clone();
  }

  setStatic(mesh) {
    //position will not change, so set to static which gives a perfomance boost
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
  }

  setSize(newSize) {
		this.dimension.copy(newSize);
	}

	setPosition(newPos) {
		this.position.copy(newPos);
	}

  dispose() {
    this.app = null;
    this.ID = null;
    this.position = null;
    this.dimension = null;
  }
}

export default SceneObject;
