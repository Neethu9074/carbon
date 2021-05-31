/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getColorPool } from 'in-services/util/ColorGenerator';

const colorPool = getColorPool('plugins');

export default class Node {
  constructor(snapshotId, pluginId, springyGraph, springyNode) {
    this.snapshotId = snapshotId;
    this.springyGraph = springyGraph;
    this.springyNode = springyNode;
    this.edgeCount = 0;
    this.color = 'rgb(255, 0, 0)';
    this.label = snapshotId;

    this.color = colorPool.getColorRGB(pluginId);
    this.plugin = pluginId;
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

  dispose() {}
}
