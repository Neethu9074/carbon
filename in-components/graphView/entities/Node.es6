import {getIconIdBySnapshot, getLabel, getIcon} from 'in-sdk/snapshot';
import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';


const colorPool = getColorPool('plugins');

export default class Node {

  constructor(snapshotId, springyGraph, springyNode) {
    this.snapshotId = snapshotId;
    this.springyGraph = springyGraph;
    this.springyNode = springyNode;
    this.edgeCount = 0;
    this.color = 'rgb(255, 0, 0)';
    this.label = snapshotId;

    this.snapshotSubscription = getSnapshot(snapshotId)
      .subscribe(snapshot => {
        this.snapshot = snapshot;
        this.color = colorPool.getColorRGB(snapshot.get('plugin'));
        this.label = getLabel(snapshot);
        this.icon = getIcon(snapshot);
        this.plugin = getIconIdBySnapshot(snapshot);
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
