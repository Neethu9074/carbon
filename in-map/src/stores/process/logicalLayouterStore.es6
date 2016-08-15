import Immutable from 'immutable';

import {createStore} from 'in-stores/store';


const nodePositions = createStore({
  name: 'processview/layouter',
  initialValue: Immutable.fromJS({})
});

export const nodePositions$ = nodePositions.observable;


export function changePosition(id, x, y, z) {
  set(id, {x, y, z, timestamp: Date.now()});
}

export function removeId(id) {
  set(id, null);
}

export function clearAll() {
  nodePositions.applyStateMutation(() => Immutable.fromJS({}));
}

function set(id, value) {
  nodePositions.applyStateMutation(nodes => {
    nodes = nodes.set(id, value);
    return nodes;
  });
}
