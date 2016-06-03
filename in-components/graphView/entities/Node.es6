import Vector from 'in-components/graphView/entities/Vector';

export default class Node {

  constructor(snapshotId) {
    this.snapshotId = snapshotId;
    this.edgeCount = 0;
    this.position = Vector.random();
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
    // TODO remove from canvas
  }

  dispose() {
    // TODO dispose snapshot subscription
  }

}
