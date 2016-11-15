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
/* eslint no-underscore-dangle: 0, no-restricted-syntax: 0 */
import {each, remove, find} from 'lodash';


const Console = console;

export default class Graph {

  constructor(nodes, edges) {
    this.validateData(nodes, edges);

    this.nodes = nodes;
    this.edges = edges;

    this._entryNodeMap = this.nodes.reduce((val, node) => {
      val[node.name] = true;
      return val;
    }, {});
    this._incomingNodes = {};
    this._outgoingNodes = {};

    this._outgoingEdges = {};

    each(edges, (edge) => {
      // Add the connection to the incoming connections object
      this._incomingNodes[edge.target] = this._incomingNodes[edge.target] || {};
      this._incomingNodes[edge.target][edge.source] = true;

      // Add the connection to the outgoing connections object
      this._outgoingNodes[edge.source] = this._outgoingNodes[edge.source] || {};
      this._outgoingNodes[edge.source][edge.target] = true;

      // Add the edge to the outgoing edges map
      this._outgoingEdges[edge.source] = this._outgoingEdges[edge.source] || [];
      this._outgoingEdges[edge.source].push(edge);

      // Remove the target node from the entry node map
      delete this._entryNodeMap[edge.target];
    });
  }


  validateData(nodes, edges) {
    const nodeMap = nodes.reduce((val, node) => {
      val[node.name] = node;
      return val;
    }, {});

    // Warn if connection connects to a node that doesnt exist
    let i;
    for (i in edges) {
      if (nodeMap[edges[i].source] === undefined) {
        Console.warn(`Attempted to layout a connection with non-existent source node: ${edges[i].source}.`);
        edges.splice(i, 1);
      } else {
        nodeMap[edges[i].source].connected = true;
      }
      if (nodeMap[edges[i].target] === undefined) {
        Console.warn(`Attempted to layout a connection with non-existent target node: ${edges[i].target}.`);
        edges.splice(i, 1);
      } else {
        nodeMap[edges[i].target].connected = true;
      }
    }

    if (nodes.length > 1) {
      for (i in nodes) {
        if (!nodeMap[nodes[i].name] || !nodeMap[nodes[i].name].connected) {
          nodes.splice(i, 1);
        }
      }
    }
  }

  outgoingNodes(nodeName) {
    if (this._outgoingNodes[nodeName] !== undefined) {
      return Object.keys(this._outgoingNodes[nodeName]);
    }
    return [];
  }

  incomingNodes(nodeName) {
    if (this._incomingNodes[nodeName] !== undefined) {
      return Object.keys(this._incomingNodes[nodeName]);
    }
    return [];
  }

  outgoingEdges(nodeName) {
    return this._outgoingEdges[nodeName] || [];
  }

  entryNodes() {
    if (this._entryNodeMap !== undefined) {
      return Object.keys(this._entryNodeMap);
    }
    return [];
  }

  buildGraph() {
    this.validateData();
  }

  removeEdge(edge) {
    delete this._outgoingNodes[edge.source][edge.target];
    delete this._incomingNodes[edge.target][edge.source];
    if (this._outgoingEdges[edge.source]) {
      remove(this._outgoingEdges[edge.source], anEdge =>
        anEdge.source === edge.source && anEdge.target === edge.target);
    }
    remove(this.edges, anEdge => anEdge.source === edge.source && anEdge.target === edge.target);
  }

  addEdge(edge) {
    this._outgoingNodes[edge.source][edge.target] = true;
    this._incomingNodes[edge.target][edge.source] = true;
    this._outgoingEdges[edge.source] = this._outgoingEdges[edge.source] || [];
    this._outgoingEdges[edge.source].push(edge);
  }

  reverseEdge(edge) {
    this.removeEdge(edge);
    const oldSource = edge.source;
    edge.source = edge.target;
    edge.target = oldSource;
    edge.reversed = !edge.reversed;
    this.addEdge(edge);
  }

  removeSameEdges() {
    this.storedSameEdges = this.storedSameEdges || [];
    each(this.edges, (edge) => {
      if (edge && edge.source === edge.target) {
        this.storedSameEdges.push(edge);
        this.removeEdge(edge);
      }
    });
  }

  restoreSameEdges() {
    each(this.storedSameEdges, (edge) => {
      this.addEdge(edge);
    });
    this.storedSameEdges.length = 0;
  }

  getNode(nodeName) {
    return find(this.nodes, ['name', nodeName]);
  }
}
