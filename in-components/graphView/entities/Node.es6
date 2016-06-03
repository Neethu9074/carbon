export default class Node {

  constructor(snapshotId) {
    this.snapshotId = snapshotId;
    this.edgeCount = 0;
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
