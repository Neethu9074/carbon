import THREE from 'three';
import _ from 'lodash';

import MouseCameraController from '../../controls/MouseCameraController';
import GroundPlane from '../GroundPlanes/GroundPlane';
import Layouter from './ReingoldFruchtermanLayouter';
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

  addNode(node) {
    const nodeId = node.get('id');
    const match = _.find(this.nodes, n => n.id === nodeId);

    if (!match) {
      const newNode = new ProcessNode({parent: this, entity: node});
      this.nodes.push(newNode);
    }
  }

  getAllNodes() {
    return this.nodes;
  }

  applyLayout() {
    const layouter = new Layouter();
    layouter.applyLayout(this);
  }

  removeChild() {}

  onInventoryUpdated() {
    this.refreshLayout = true;
  }

  dispose() {
    super.dispose();
  }
}
