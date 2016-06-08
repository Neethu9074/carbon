import immutable from 'immutable';

import {nodes$} from 'in-map/src/3DSceneObjects/process/processViewStores';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Connection from 'in-map/src/3DSceneObjects/process/Connection';


export default class Edge {

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
    if (sourceNode && destinationNode) {
      this.disposeConnection();

      this.connection = new Connection({
        parent: this.parent,
        entity: immutable.fromJS({
          id: this.edgeId,
          plugin: 'connection'
        }),
        sourceNode,
        destinationNode,
        direction: DIRECTIONS.OUT
      });
    } else {
      this.disposeConnection();
    }
  }

  disposeConnection() {
    if (this.connection) {
      this.connection.dispose();
    }
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
