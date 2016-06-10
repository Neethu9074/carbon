import {createStore} from 'in-stores/store';


const nodes = createStore({
  name: 'processViewNodesStore',
  initialValue: {}
});
export const nodes$ = nodes.observable;

export function addNode(node) {
  nodes.applyStateMutation(nodeMap => {
    nodeMap[node.id] = node;
    return nodeMap;
  });
}

export function removeNode(node) {
  nodes.applyStateMutation(nodeMap => {
    delete nodeMap[node.id];
    return nodeMap;
  });
}


const edges = createStore({
  name: 'processViewEdgesStore',
  initialValue: {}
});
export const edges$ = edges.observable;

export function addEdge(node) {
  edges.applyStateMutation(edgeMap => {
    edgeMap[node.id] = node;
    return edgeMap;
  });
}

export function removeEdge(node) {
  edges.applyStateMutation(edgeMap => {
    delete edgeMap[node.id];
    return edgeMap;
  });
}


const nodeIdVoting = createStore({
  name: 'processViewExpandedNodeIdsStore',
  initialValue: {}
});
export const nodeIdVoting$ = nodeIdVoting.observable;

export function voteUp(id) {
  nodeIdVoting.applyStateMutation(nodeMap => {
    if (!nodeMap[id]) {
      nodeMap[id] = 0;
    }
    nodeMap[id]++;
    return nodeMap;
  });
}

export function voteDown(id) {
  nodeIdVoting.applyStateMutation(nodeMap => {
    if (!nodeMap[id]) {
      return nodeMap;
    }

    nodeMap[id]--;
    if (nodeMap[id] === 0) {
      delete nodeMap[id];
    }
    return nodeMap;
  });
}


const nodeMetricsAreActive = createStore({
  name: 'nodeMetricsAreActiveStore',
  initialValue: false
});
export const nodeMetricsAreActive$ = nodeMetricsAreActive.observable;

export function toggleNodeMetrics() {
  nodeMetricsAreActive.applyStateMutation(oldValue => !oldValue);
}


const connectionMetricsAreActive = createStore({
  name: 'connectionMetricsAreActiveStore',
  initialValue: false
});
export const connectionMetricsAreActive$ = connectionMetricsAreActive.observable;

export function toggleConnectionMetrics() {
  connectionMetricsAreActive.applyStateMutation(oldValue => !oldValue);
}
