/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable no-console */
import { markAsFinished } from 'in-components/graphView/graphViewStore';
import Springy from 'in-components/graphView/layout/springy3d';
import Edge from 'in-components/graphView/entities/Edge';
import Node from 'in-components/graphView/entities/Node';
import { timeConfig$ } from 'in-stores/time/config';
import getGraph from 'in-subscription/graph';

export default class Graph {
  constructor() {
    this.springyGraph = new Springy.Graph();
    this.springyLayout = new Springy.Layout.ForceDirected(this.springyGraph, 100.0, 200.0, 0.5);

    // maps node id => node instance
    this.nodes = {};

    // maps edge id => edge instance
    this.edges = {};

    this.graphSubscription = timeConfig$
      .flatMap(timeConfig => {
        return getGraph(timeConfig).throttle(60000);
      })
      .once(this.processEdgeModifications.bind(this));
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

    this.removeUnusedNodes();
    this.restartLayoutProcess();
  }

  removeUnusedNodes() {
    Object.keys(this.nodes).forEach(snapshotId => {
      const node = this.nodes[snapshotId];

      if (node.getEdgeCount() === 0) {
        node.remove();
        node.dispose();
        delete this.nodes[snapshotId];
      }
    });
  }

  restartLayoutProcess() {
    console.log(
      '(Re-) starting layout with %s nodes and %s edges',
      Object.keys(this.nodes).length,
      Object.keys(this.edges).length
    );
    // start another layouting run
    this.springyLayout.start(3, () => {}, markAsFinished);
  }

  processGraphRetrieval(graph) {
    const edgesToRemove = Object.keys(this.edges).reduce((agg, edgeId) => {
      agg[edgeId] = true;
      return agg;
    }, {});

    graph.forEach(newEdge => {
      const edgeId = newEdge.id;
      edgesToRemove[edgeId] = false;

      if (this.edges[edgeId]) {
        // nothing to do, edge already exists
        return;
      }

      const fromNode = this.getOrCreateNode(newEdge.from);
      const toNode = this.getOrCreateNode(newEdge.to);
      const springyEdge = this.springyGraph.newEdge(fromNode.springyNode, toNode.springyNode);

      this.edges[edgeId] = new Edge(edgeId, fromNode, toNode, newEdge.relation, this.springyGraph, springyEdge);
      fromNode.increaseEdgeCount();
      toNode.increaseEdgeCount();
    });

    Object.keys(edgesToRemove).forEach(edgeId => {
      if (edgesToRemove[edgeId] === true && this.edges[edgeId]) {
        const edge = this.edges[edgeId];
        edge.from.decreaseEdgeCount();
        edge.to.decreaseEdgeCount();
        edge.remove();
        edge.dispose();
        delete this.edges[edgeId];
      }
    });

    this.removeUnusedNodes();
    this.restartLayoutProcess();
  }

  getOrCreateNode(snapshotId) {
    let existingNode = this.nodes[snapshotId];
    if (existingNode) {
      return existingNode;
    }

    const springyNode = this.springyGraph.newNode({ label: snapshotId });
    existingNode = this.nodes[snapshotId] = new Node(snapshotId, this.springyGraph, springyNode);
    return existingNode;
  }

  eachEdge(fn) {
    Object.keys(this.edges).forEach(edgeId => fn(this.edges[edgeId]));
  }

  eachNode(fn) {
    Object.keys(this.nodes).forEach(nodeId => fn(this.nodes[nodeId]));
  }

  dispose() {
    this.graphSubscription.dispose();
    Object.keys(this.nodes).forEach(nodeId => this.nodes[nodeId].dispose());
  }
}
