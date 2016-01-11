import THREE from 'three';
import _ from 'lodash';

import MouseCameraController from '../../controls/MouseCameraController';
import GroundPlane from '../GroundPlanes/GroundPlane';
import ProcessNode from '../Nodes/ProcessNode';
import BaseMap from './BaseMap';


export default class ProcessMap extends BaseMap {

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
    return new MouseCameraController({
      scene: this.scene,
      map: this,
      canvas
    });
  }

  onZoom() {}

  addNode(coordinates) {
    const nodeId = coordinates.node.get('id');
    const match = _.find(this.nodes, node => node.id === nodeId);

    if (!match) {
      const newNode = new ProcessNode({
        parent: this,
        coordinates: coordinates.node,
        id: nodeId
      });
      this.nodes.push(newNode);
    }
  }

  getAllNodes() {
    return this.nodes;
  }

  applyLayout() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.getComponent('position').setPosition(i + 1, 0, 0);
    }
  }

  removeChild() {}

  onInventoryUpdated() {
    this.refreshLayout = true;
  }

  dispose() {
    super.dispose();
  }
}
