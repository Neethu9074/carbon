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
