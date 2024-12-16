/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default class Edge {
  constructor(edgeId, from, to, relation, springyGraph, springyEdge) {
    this.edgeId = edgeId;
    this.from = from;
    this.to = to;
    this.relation = relation;
    this.springyGraph = springyGraph;
    this.springyEdge = springyEdge;
  }

  remove() {
    this.springyGraph.removeEdge(this.springyEdge);
  }

  dispose() {
    // TODO dispose subscriptions
  }
}
