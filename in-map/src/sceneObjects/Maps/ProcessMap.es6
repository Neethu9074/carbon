import THREE from 'three';
import _ from 'lodash';

import CameraController from '../../controls/ProcessCameraController';
import Layouter from './Layouter/FruchtermanReingoldLayouter';
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
    return new CameraController({
      canvas,
      scene: this.scene,
      camera: this.camera
    });
  }

  onZoom() {}

  addEntity(entity) {
    const entityId = entity.get('id');
    let matchedNode = _.find(this.nodes, n => n.id === entityId);

    if (!matchedNode) {
      matchedNode = new ProcessNode({parent: this, entity});
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
    const layouter = new Layouter();
    layouter.applyLayout(this);
  }

  removeChild() {}

  dispose() {
    super.dispose();
  }
}
