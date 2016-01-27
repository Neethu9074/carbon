import Immutable from 'immutable';
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

      // set layer and connections, no matter if a new node was created or it's still available
      matchedNode.setChildren(entity.get('children'));

      const connectionsHandler = matchedNode.getComponent('connectionsHandler');
      connectionsHandler.setOutgoingConnections(entity.get('outgoingConnections'));
      connectionsHandler.setIncomingConnections(entity.get('incomingConnections'));

      console.log(
        'children', entity.get('children').size,
        'out', entity.get('outgoingConnections').size,
        'in', entity.get('incomingConnections').size
      );

      this.nodes.push(matchedNode);
    }
  }

  onInventoryUpdated() {
    // test add random connections
    const ids = this.nodes.map(node => node.id);
    this.nodes.forEach(node => {
      const randomId = ids[Math.floor(Math.random() * (ids.length - 1))];
      if (randomId !== node.id) {
        const connectionsHandler = node.getComponent('connectionsHandler');
        connectionsHandler.setOutgoingConnections(Immutable.fromJS([
          {
            id: randomId + '_connection',
            sourceId: node.id,
            destinationId: randomId
          }
        ]));
      }
    });

    this.refreshLayout = true;
  }

  getAllNodes() {
    return this.nodes;
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
