import {createStore} from 'in-stores/store';


let callback = undefined;
export function init(_callback) {
  callback = _callback;
}

const nodeIdVoting = createStore({
  name: 'processView/physicalNodeIdVoting',
  initialValue: {}
});
export const nodeIdVoting$ = nodeIdVoting.observable;


export function voteUp(id) {
  nodeIdVoting.applyStateMutation(nodeMap => {
    if (!nodeMap[id]) {
      nodeMap[id] = 0;
      callback.addPhysicalNode(id);
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
      callback.removePhysicalNode(id);
    }
    return nodeMap;
  });
}
