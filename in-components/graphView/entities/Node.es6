import {getSnapshot} from 'in-stores/snapshot';

export default class Node {

  constructor(snapshotId, springyGraph, springyNode) {
    this.snapshotId = snapshotId;
    this.springyGraph = springyGraph;
    this.springyNode = springyNode;
    this.edgeCount = 0;

    this.snapshotSubscription = getSnapshot(snapshotId)
      .subscribe(snapshot => {
        this.snapshot = snapshot;
      });
  }

  increaseEdgeCount() {
    this.edgeCount++;
  }

  decreaseEdgeCount() {
    this.edgeCount--;
  }

  getEdgeCount() {
    return this.edgeCount;
  }

  remove() {
    this.springyGraph.removeNode(this.springyNode);
  }

  dispose() {
    this.snapshotSubscription.dispose();
  }

}
