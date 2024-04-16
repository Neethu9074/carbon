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
import {
  Graph,
  TransformedAPMapNode,
  APMapGraphEdge //@ts-expect-error Need TS migration

} from 'in-applications/ApplicationMap/misc/layouting/vizceralResources/Graph';
export function dfsFas(graph: Graph): APMapGraphEdge {
  const fas: Array<APMapGraphEdge> = [];
  const stack = new Map();
  const visited: {
    [key: string]: boolean;
  } = {};

  function dfs(node: TransformedAPMapNode) {
    if (!node || visited[node.name]) {
      return;
    }

    visited[node.name] = true;
    stack.set(node.name, true);

    const edges = graph.outgoingEdges(node.name);
    for (let i = 0, length = edges.length; i < length; i++) {
      const edge = edges[i];
      if (stack.has(edge.target)) {
        fas.push(edge);
      } else {
        dfs(graph.getNode(edge.target));
      }
    }
    stack.delete(node.name);
  }
  graph.nodes.forEach(dfs);
  return fas;
}

export function remove(graph: Graph) {
  const fas = dfsFas(graph);
  for (let i = 0, length = fas.length; i < length; i++) {
    graph.reverseEdge(fas[i]);
  }
}

export function restore(graph: Graph) {
  for (let i = 0, length = graph.edges.length; i < length; i++) {
    const edge = graph.edges[i];
    if (edge.reversed) {
      graph.reverseEdge(edge);
    }
  }
}
