import immutable from 'immutable';

import {viewStructure} from 'in-stores/view';


export default class GraphToProcessViewAdapter {

  constructor(client) {
    this.client = client;

    this.viewStructureSubscription = viewStructure.subscribe(root => this.onInventoryUpdate(root));
  }

  onInventoryUpdate(root) {
    const subNodes = {};

    // setup structure
    root.get('children').forEach(processNodeEntity => {
      const processNodeId = processNodeEntity.get('id');
      this.client.createNode(processNodeId);

      processNodeEntity.get('outgoingConnections').forEach(connectionEntity =>
        this.client.createEdge(connectionEntity));

      processNodeEntity.get('children').forEach(physicalNodeEntity => {
        const physicalNodeId = physicalNodeEntity.get('id');
        physicalNodeEntity.get('outgoingConnections').forEach(connectionEntity =>
          this.client.createEdge(connectionEntity));

        this.client.createEdge(immutable.fromJS({
          id: processNodeId + ',' + physicalNodeId,
          from: processNodeId,
          to: physicalNodeId
        }));

        if (!subNodes[physicalNodeId]) {
          subNodes[physicalNodeId] = [];
        }
        subNodes[physicalNodeId].push(processNodeId);
      });
    });

    Object.keys(subNodes).forEach(physicalNodeId => {
      const parentNodeIds = subNodes[physicalNodeId];
      this.client.createSubNode(physicalNodeId, parentNodeIds);
    });

    // this.removeUnusedNodes();
  }

  removeUnusedNodes() {
    this.client.removeNode();
  }

  dispose() {
    this.viewStructureSubscription.dispose();
    this.viewStructureSubscription = null;

    this.client = null;
  }
}
