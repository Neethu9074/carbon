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
