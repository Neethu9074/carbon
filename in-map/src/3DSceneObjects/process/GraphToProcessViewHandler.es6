import {remove} from 'lodash';

import {emptyArray} from 'in-services/fixedObjects';
import {viewStructure} from 'in-stores/view';


const ADD = 'add';
const OF = 'of';

export default class GraphToProcessViewAdapter {

  constructor(client) {
    this.nodes = {};
    this.edges = {};

    // needed for fast parent lookup
    this.parentLUT = {};

    this.client = client;

    this.viewStructureSubscription = viewStructure.subscribe(structures => this.onInventoryUpdate(structures));
  }

  onInventoryUpdate(edgeModifications) {
    // maps node id => node instance used to remove unused nodes from the graph
    const modifiedNodes = {};

    edgeModifications.forEach(edgeModification => {
      const from = edgeModification.get('from');
      const to = edgeModification.get('to');

      if (edgeModification.get('relation') === OF) {
        if (edgeModification.get('type') === ADD) {
          if (!this.parentLUT[from]) {
            this.parentLUT[from] = [];
          }
          this.parentLUT[from].push(to);
        } else {
          remove(this.parentLUT[from], id => id === to);
        }
      }
    });

    edgeModifications.forEach(edgeModification => {
      const edgeId = edgeModification.get('id');
      const fromNode = this.getOrCreateNode(edgeModification.get('from'));
      modifiedNodes[fromNode.id] = fromNode;
      const toNode = this.getOrCreateNode(edgeModification.get('to'));
      modifiedNodes[toNode.id] = toNode;

      if (edgeModification.get('type') === ADD) {
        // nothing to do, we already know about this edge
        if (this.edges[edgeId]) {
          return;
        }

        this.edges[edgeId] = true;
        this.client.createEdge(edgeId, edgeModification);

        fromNode.increaseEdgeCount();
        toNode.increaseEdgeCount();
      } else {
        const edge = this.edges[edgeId];

        // nothing to do, we never knew about this edge
        if (!edge) {
          return;
        }

        delete this.edges[edgeId];
        this.client.removeEdge(edgeId);

        fromNode.decreaseEdgeCount();
        toNode.decreaseEdgeCount();
      }
    });

    this.removeUnusedNodes();
  }

  removeUnusedNodes() {
    Object.keys(this.nodes).forEach(snapshotId => {
      const node = this.nodes[snapshotId];

      if (node.getEdgeCount() === 0) {
        delete this.nodes[snapshotId];
        this.client.removeNode(snapshotId);
      }
    });
  }

  getOrCreateNode(snapshotId) {
    let existingNode = this.nodes[snapshotId];
    if (existingNode) {
      return existingNode;
    }

    existingNode = this.nodes[snapshotId] = this.createNode(snapshotId);

    const parentNodeIds = this.getParentNodeIdsFor(snapshotId);
    if (parentNodeIds.length === 0) {
      this.client.createNode(snapshotId);
    } else {
      this.client.createSubNode(snapshotId, parentNodeIds);
    }
    return existingNode;
  }

  getParentNodeIdsFor(nodeId) {
    return this.parentLUT[nodeId] ? this.parentLUT[nodeId] : emptyArray;
  }

  createNode(id) {
    let edgeCount = 0;
    return {
      id,
      getEdgeCount: () => {
        return edgeCount;
      },
      increaseEdgeCount: () => {
        edgeCount++;
      },
      decreaseEdgeCount: () => {
        edgeCount--;
      }
    };
  }

  dispose() {
    this.viewStructureSubscription.dispose();

    this.parentLUT = null;
    this.client = null;
    this.nodes = null;
    this.edges = null;
  }
}
