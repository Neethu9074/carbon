/**
 *
 *  Copyright 2016 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
import {
  forceSecondaryRankPromotions,
  forcePrimaryRankPromotions,
  longestPathRanking,
  normalizeRanks
} from './ranker';
import {remove, restore} from './acyclicFAS';
import Graph from './Graph';


export default class LTRTreeLayouter {

  constructor() {}

  sortNodesByDepth(graph) {
    // Build the map of nodes to their levels
    let nodesSortedByDepth = [];
    let index;
    for (index in graph.nodes) {
      if ({}.hasOwnProperty.call(graph.nodes, index)) {
        const node = graph.nodes[index];
        nodesSortedByDepth[node.rank] = nodesSortedByDepth[node.rank] || [];
        nodesSortedByDepth[node.rank].push(node);
      }
    }

    // Remove empty ranks (and normalize to base 0)
    nodesSortedByDepth = nodesSortedByDepth.reduce((a, n) => { a.push(n); return a; }, []);

    const maxNodesPerDepth = 30;
    for (let i = 0; i < nodesSortedByDepth.length; i++) {
      const nodesInDepth = nodesSortedByDepth[i];
      if (nodesInDepth.length > maxNodesPerDepth) {
        const nodesToKeep = Math.min((nodesInDepth.length / 2) - 1, maxNodesPerDepth);
        const newNodeDepth = nodesInDepth.splice(nodesToKeep);
        nodesSortedByDepth.splice(i + 1, 0, newNodeDepth);
      }
    }

    return nodesSortedByDepth;
  }

  sortNodesWithinDepth(nodesSortedByDepth) {
    for (let i = 0; i < nodesSortedByDepth.length; i++) {
      const nodesAtDepth = nodesSortedByDepth[i];
      const newNodesAtDepth = [];
      nodesAtDepth.sort(weightSort);

      // Heaviest in the middle, lightest to the outside
      for (let j = nodesAtDepth.length - 1; j >= 0; j--) {
        if (j % 2) {
          newNodesAtDepth.push(nodesAtDepth[j]);
        } else {
          newNodesAtDepth.unshift(nodesAtDepth[j]);
        }
      }
      nodesSortedByDepth[i] = newNodesAtDepth;
    }
  }

  positionNodes(nodesSortedByDepth, dimensions) {
    const nodePositions = {};
    let lastYDelta = 0;
    let yOffset = -35;

    function setPositions(column, nodesAtDepth, xDelta) {
      const curXDelta = xDelta * column;
      const yDelta = dimensions.height / (nodesAtDepth.length + 1);
      const needsYOffset = yDelta < lastYDelta ? lastYDelta % yDelta < 1 : yDelta % lastYDelta < 1;
      if (needsYOffset) { yOffset = -yOffset; }

      for (let j = 0; j < nodesAtDepth.length; j++) {
        const curYDelta = (yDelta * (j + 1)) + (needsYOffset ? yOffset : 0);
        nodePositions[nodesAtDepth[j].name] = { x: curXDelta, y: curYDelta };
      }

      lastYDelta = yDelta;
    }

    let xDelta;
    if (nodesSortedByDepth.length === 1) {
      xDelta = dimensions.width / 2;
      setPositions(1, nodesSortedByDepth[0], xDelta);
    } else {
      xDelta = dimensions.width / (nodesSortedByDepth.length - 1);
      for (let i = 0; i < nodesSortedByDepth.length; i++) {
        setPositions(i, nodesSortedByDepth[i], xDelta);
      }
    }

    return nodePositions;
  }

  layout(nodes, edges, dimensions, entryNode) {
    const graph = new Graph(nodes, edges); // Build a simple graph object
    graph.removeSameEdges(); // Remove edges that have same source and target
    remove(graph); // Remove acyclic links
    longestPathRanking(graph); // Run a longest path algorithm to build a layout baseline
    // TODO: Rank the nodes from the dropped same edges...

    restore(graph); // Restore acyclic links
    graph.restoreSameEdges(); // Replace edges that have same source and target

    normalizeRanks(graph); // Normalize node ranks to be 0++
    forcePrimaryRankPromotions(graph, entryNode); // Force all entry nodes to be first

    // Force any leafs that are one level deep from specified entry node to not move all the way to the edge
    forceSecondaryRankPromotions(graph, entryNode);

    const nodesSortedByDepth = this.sortNodesByDepth(graph);
    this.sortNodesWithinDepth(nodesSortedByDepth);
    const nodePositions = this.positionNodes(nodesSortedByDepth, dimensions);
    return nodePositions;
  }
}

function weightSort(a, b) {
  if (a.weight === b.weight) { return 0; }
  if (a.weight === undefined || a.weight < b.weight) { return 1; }
  return -1;
}
