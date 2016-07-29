import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import nodes from 'in-map/stores/physical/nodes';


export default class Node extends SceneObject {

  constructor(params) {
    super(params.id);

    this.group = params.group;
    this._cachedLabel = this.id;
  }

  init() {
    super.init();

    const mesh = this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
      new THREE.MeshBasicMaterial()
    );
    addSceneObject(mesh);

    nodes.add(this.id);
    this.group.addNode(this.id, this);
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      this.eventEmitter.on('positionChanged').subscribe(pos => this.mesh.position.copy(pos))
    );
  }

  dispose() {
    super.dispose();

    nodes.remove(this.id);
    this.group.removeNode(this.id);

    removeSceneObject(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;

    this._cachedLabel = null;
    this.group = null;
  }
}
