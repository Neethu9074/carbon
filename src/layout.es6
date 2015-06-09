'use strict';

import THREE from 'three';
import ConnectionGrid from './connectionGrid';
import Group from './sceneObjects/Group';
import {getAllNodes, getChildren} from './mapStructureUtils';
import {getPower} from 'instana-ui-sdk/power';


export default class Layouter {
  constructor({
    nodeSize = 1,
    maxNodeHeight = 3,
    groupPadding = 1,
    groupMargin = 1,
    maxNodesPerRow = 3,
    nodePadding = 2} = {}) {

    this.nodeSize = nodeSize;
    this.maxNodeHeight = maxNodeHeight;
    this.groupPadding = groupPadding;
    this.groupMargin = groupMargin;
    this.maxNodesPerRow = maxNodesPerRow;
    this.nodePadding = nodePadding;

    this.connections = [];

    // Each node takes up one unit horizontally.
    this.groupWidth = maxNodesPerRow +
      // Between the nodes we have some empty space.
      (maxNodesPerRow - 1) * nodePadding +
      // Before the first and after the last node we have group padding.
      groupPadding * 2;
  }

  applyLayout({parent, xOffset=0, yOffset=0, vertical=true}) {
    let col = getChildren(parent);
    if(!col) {return; }

    let x = 0;
    let y = 0;
    const margin = this.groupMargin;

    col.forEach((child) => {
      if(child instanceof Group) {
        const dimension = child.getDimension();
        const width = dimension.width;
        const depth = dimension.depth;

        child.setScale(new THREE.Vector3(width, depth, 1));

        if(vertical) {
          child.setPosition(x + width / 2, 0, -depth / 2);
          this.applyLayout({parent: child, xOffset: x, vertical: false});
          x += margin + width;

        } else {
          child.setPosition(
            x + margin + width / 2,
            0,
            -(y + margin + depth / 2));
            this.applyLayout({
              parent: child,
              xOffset: x + margin,
              yOffset: y + margin,
              vertical: false});
            y += depth + margin;
        }

      //it's a node
      } else {
        this.setNodeToPos({
          node: child,
          x: xOffset + margin + 1,
          z: -(y + margin + 1) - yOffset
        });
        y += 1 + margin;
      }
    });
  }

  setNodeToPos({node, x=0, y=0, z=0}) {
    const oldPos = node.getPosition().clone();
    const newPos = new THREE.Vector3(x, y, z);

    node.setPosition(newPos.x, newPos.y, newPos.z);

    ConnectionGrid.clearPosition(oldPos);
    ConnectionGrid.blockPosition(newPos);
  }

  updateHeight(map) {
    const nodes = getAllNodes(map);
    const maxPower = this.getMaxPower(nodes);
    const baseHeight = this.nodeSize;
    const growthRange = this.maxNodeHeight - this.nodeSize;
    nodes.forEach(node => {
      const weightedHeight = growthRange * (node.calculatePower() / maxPower);
      node.setHeight(baseHeight + weightedHeight);
    });
  }

  getMaxPower(nodes) {
    return nodes.reduce((power, node) => {
      return Math.max(power, node.calculatePower());
    }, 0);
  }
}
