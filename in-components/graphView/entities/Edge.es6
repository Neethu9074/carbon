export default class Edge {

  constructor(edgeId, from, to, relation) {
    this.edgeId = edgeId;
    this.from = from;
    this.to = to;
    this.relation = relation;
  }

  remove() {
    // TODO remove from canvas
  }

  dispose() {
    // TODO dispose subscriptions
  }

}
