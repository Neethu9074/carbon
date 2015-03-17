'use strict';

class SceneObject{
  constructor(app, ID, pos, dim) {
    if(app === undefined || ID === undefined ||
      pos === undefined || dim === undefined) {
      return;
    }

    this.app = app;
    this.ID = ID;
    this.position = pos.clone();
    this.dimension = dim.clone();
  }

    setStatic(mesh) {
    //position will not change, so set to static which gives a perfomance boost
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
  }

    dispose() {
    this.app = null;
    this.ID = null;
    this.position = null;
    this.dimension = null;
  }
}

export default SceneObject;
