import Springy from 'in-components/graphView/layout/springy3d';
import Edge from 'in-components/graphView/entities/Edge';
import Node from 'in-components/graphView/entities/Node';
import getGraph from 'in-services/subscription/graph';
import {focusedMoment$} from 'in-stores/timeline';

export default class Graph {
  constructor() {
    this.springyGraph = new Springy.Graph();
    this.springyLayout = new Springy.Layout.ForceDirected(this.springyGraph, 400.0, 400.0, 0.5);

    // maps node id => node instance
    this.nodes = {};

    // maps edge id => edge instance
    this.edges = {};

    this.graphSubscription = focusedMoment$.flatMap(focusedMoment => {
        return getGraph(focusedMoment)
          .throttle(60000);
      })
      .subscribe(this.processEdgeModifications.bind(this));

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

        const springyEdge = this.springyGraph.newEdge(fromNode.springyNode, toNode.springyNode);
        this.edges[edgeId] = new Edge(
          edgeId,
          fromNode,
          toNode,
          edgeModification.relation,
          this.springyGraph,
          springyEdge
        );
        fromNode.increaseEdgeCount();
        toNode.increaseEdgeCount();
      } else {
        const edge = this.edges[edgeId];

        // nothing to do, we never knew about this edge
        if (!edge) {
          return;
        }

        edge.remove();
        edge.dispose();
        delete this.edges[edgeId];
        fromNode.decreaseEdgeCount();
        toNode.decreaseEdgeCount();
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


    console.log(
      '(Re-) starting layout with %s nodes and %s edges',
      Object.keys(this.nodes).length,
      Object.keys(this.edges).length
    );
    // start another layouting run
    this.springyLayout.start();
  }

  getOrCreateNode(snapshotId) {
    let existingNode = this.nodes[snapshotId];
    if (existingNode) {
      return existingNode;
    }

    const springyNode = this.springyGraph.newNode({label: snapshotId});
    existingNode = this.nodes[snapshotId] = new Node(snapshotId, this.springyGraph, springyNode);
    return existingNode;
  }

  eachEdge(fn) {
    Object.keys(this.edges).forEach(edgeId => fn(this.edges[edgeId]));
  }

  dispose() {
    this.graphSubscription.dispose();
    Object.keys(this.nodes).forEach(nodeId => this.nodes[nodeId].dispose());
  }
}
