/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/**
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
 */
const minimumLength = 1;

export function longestPathRanking(graph) {
  const visited = {};

  function dfs(val, nodeName) {
    const node = graph.getNode(nodeName);
    if (!node) {
      return undefined;
    }
    if (!visited[nodeName]) {
      visited[nodeName] = true;

      let rank = graph
        .outgoingEdges(nodeName)
        .map(edge => dfs(null, edge.target) - minimumLength)
        .sort((a, b) => a - b)[0];

      if (rank === undefined) {
        rank = 0;
      }
      node.rank = rank;
    }
    return node.rank;
  }

  graph.entryNodes().forEach(dfs);
}

export function normalizeRanks(graph) {
  let i;
  let lowestRank = Infinity;
  // First make the ranks positive
  for (i = 0; i < graph.nodes.length; i++) {
    if (graph.nodes[i].rank < lowestRank) {
      lowestRank = graph.nodes[i].rank;
    }
  }
  for (i = 0; i < graph.nodes.length; i++) {
    graph.nodes[i].rank -= lowestRank;
  }
}

export function forcePrimaryRankPromotions(graph) {
  let entryNodes = graph.entryNodes();
  entryNodes.forEach(entryNode => {
    entryNode.rank = 0;
  });
}

export function forceSecondaryRankPromotions(graph) {
  let entryNodes = graph.entryNodes();
  entryNodes.forEach((entryNode, key) => {
    const outgoingNodes = graph.outgoingNodes(key);
    for (let j = 0; j < outgoingNodes.length; j++) {
      const node = graph.getNode(outgoingNodes[j]);
      if (node) {
        node.rank = 1;
      }
    }
  });
}
