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
    nodeMap[node.id] = undefined;
    return nodeMap;
  });
}
