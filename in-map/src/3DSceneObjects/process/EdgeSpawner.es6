import immutable from 'immutable';

import ConnectionBetweenProcessAndPhysical from 'in-map/src/3DSceneObjects/process/ConnectionBetweenProcessAndPhysical';
import ConnectionWithKPI from 'in-map/src/3DSceneObjects/process/ConnectionWithKPI';
import NodePhysical from 'in-map/src/3DSceneObjects/process/NodePhysical';
import NodeCluster from 'in-map/src/3DSceneObjects/process/NodeCluster';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import {nodes$} from 'in-map/src/stores/process/nodesStore';


export default class EdgeSpawner {

  constructor(edge, map) {
    this.parent = map;
    this.connection = undefined;
    this.edgeId = edge.get('id');
    this.sourceNode = edge.get('from');
    this.destinationNode = edge.get('to');

    this.visibleSubscription = nodes$.subscribe(currentVisibleNodeIds =>
      this.setVisible(currentVisibleNodeIds[this.sourceNode], currentVisibleNodeIds[this.destinationNode]));
  }

  setVisible(sourceNode, destinationNode) {
    this.disposeConnection();
    if (sourceNode && destinationNode) {
      const config = {
        parent: this.parent,
        entity: immutable.fromJS({
          id: this.edgeId,
          plugin: 'connection'
        }),
        sourceNode,
        destinationNode,
        direction: DIRECTIONS.OUT
      };

      if ((sourceNode instanceof NodeCluster && destinationNode instanceof NodeCluster) ||
          (sourceNode instanceof NodePhysical && destinationNode instanceof NodePhysical)) {
        this.connection = new ConnectionWithKPI(config);
      } else {
        this.connection = new ConnectionBetweenProcessAndPhysical(config);
      }
    }
  }

  disposeConnection() {
    if (this.connection) {
      this.connection.dispose();
    }
    this.connection = undefined;
  }

  dispose() {
    this.visibleSubscription.dispose();
    this.disposeConnection();

    this.parent = null;
    this.edgeId = null;
    this.connection = null;
    this.sourceNode = null;
    this.destinationNode = null;
  }
}
