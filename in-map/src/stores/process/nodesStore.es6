import {create} from 'reactive-observables';

import {createStore} from 'in-stores/store';


const nodes = {};
export const nodes$ = create();

export function addNode(node) {
  nodes[node.id] = node;
  nodes$.emit(nodes);
}

export function removeNode(node) {
  delete nodes[node.id];
  nodes$.emit(nodes);
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
