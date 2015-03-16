'use strict';

exports.SceneObject = function SceneObject(app, ID, pos, dim) {
  if(app === undefined || ID === undefined) {
    return;
  }

  this.app = app;
  this.ID = ID;
  this.position = pos.clone();
  this.dimension = dim.clone();
};

exports.SceneObject.prototype.setStatic = function(mesh) {
  //position will not change, so set to static which gives a perfomance boost
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
};

exports.SceneObject.prototype.getName = function() {
	return this.name;
};
