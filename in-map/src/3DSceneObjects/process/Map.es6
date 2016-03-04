import THREE from 'three';
import find from 'lodash/find';

import CameraController from 'in-map/src/controls/process/CameraController';

import GroundPlane from '../common/GroundPlane';
import BaseMap from '../common/Map';
import Layouter from './Layouter';
import Node from './Node';


export default class Map extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'ProcessMap'});
  }

  init() {
    this.nodes = [];
  }

  getGroundPlane() {
    const groundPlane = new GroundPlane({
      parent: this,
      size: this.size
    });
    groundPlane.setColor(new THREE.Color(0x445b63));
    return groundPlane;
  }

  getController(canvas) {
    return new CameraController({
      canvas,
      scene: this.scene,
      camera: this.camera
    });
  }

  onZoom() {}

  addEntity(entity) {
    const entityId = entity.get('id');
    let matchedNode = find(this.nodes, n => n.id === entityId);

    if (!matchedNode) {
      matchedNode = new Node({parent: this, entity});
      this.nodes.push(matchedNode);
    }
  }

  getAllNodes() {
    const nodes = [];
    this.nodes.forEach(child => this.getNodes(child, nodes));
    return nodes;
  }

  getNodes(parent, nodes) {
    nodes.push(parent);

    const children = parent.nodes;
    children.forEach(child => this.getNodes(child, nodes));
  }

  applyLayout() {
    // refresh all connections before layouting!
    //
    this.getAllNodes().forEach(node => node.getComponent('connectionsHandler').checkForUpdate());

    const layouter = new Layouter();
    layouter.applyLayout(this);
  }

  removeChild() {}

  dispose() {
    super.dispose();
  }
}
