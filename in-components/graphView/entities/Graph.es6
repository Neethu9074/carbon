import Edge from 'in-components/graphView/entities/Edge';
import Node from 'in-components/graphView/entities/Node';
import getGraph from 'in-services/subscription/graph';
import focusedMoment$ from 'in-stores/timeline';

export default class Graph {
  constructor() {
    // maps node id => node instance
    this.nodes = {};

    // maps edge id => edge instance
    this.edges = {};

    this.graphSubscription = focusedMoment$.flatMap(getGraph)
      .subscribe(edgeModifications => this.processEdgeModifications(edgeModifications));
  }


  processEdgeModifications(edgeModifications) {
    // maps node id => node instance
    // used to remove unused nodes from the graph
    const modifiedNodes = {};


    edgeModifications.forEach(edgeModification => {
      const edgeId = edgeModification.id;
      const fromNode = this.getOrCreateNode(edgeModification.from);
      modifiedNodes[fromNode.snapshotId] = fromNode;
      const toNode = this.getOrCreateNode(edgeModification.to);
      modifiedNodes[toNode.snapshotId] = toNode;

      if (edgeModification.modificationType === 'ADD') {
        // nothing to do, we already know about this edge
        if (this.edges[edgeId]) {
          return;
        }

        this.edges[edgeId] = new Edge(
          edgeId,
          fromNode,
          toNode,
          edgeModification.relation
        );
      } else {
        const edge = this.edges[edgeId];

        // nothing to do, we never knew about this edge
        if (!edge) {
          return;
        }

        edge.remove();
        edge.dispose();
        delete this.edges[edgeId];
      }
    });


    // remove all nodes which are no longer involved in any connections
    Object.keys(modifiedNodes).forEach(snapshotId => {
      const node = modifiedNodes[snapshotId];
      if (node.getEdgeCount() === 0) {
        node.remove();
        node.dispose();
        delete this.nodes[snapshotId];
      }
    });
  }

  getOrCreateNode(snapshotId) {
    let existingNode = this.nodes[snapshotId];
    if (existingNode) {
      return existingNode;
    }

    existingNode = this.nodes[snapshotId] = new Node(snapshotId);
    return existingNode;
  }

  dispose() {
    this.graphSubscription.dispose();
    Object.keys(this.nodes).forEach(nodeId => this.nodes[nodeId].dispose());
  }
}
