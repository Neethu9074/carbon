import {create} from 'reactive-observables';
import Immutable from 'immutable';

import FruchtermannReingold from 'in-map/misc/logical/layoutingStrategies/FruchtermannReingold';
import {createStore} from 'in-stores/store';


export const currentLayoutingStrategy$ = create();

export function setLayoutingStrategy(newScene) {
  currentLayoutingStrategy$.emit(newScene);
}

setLayoutingStrategy(FruchtermannReingold);


const nodePositions = createStore({
  name: 'logical/nodePositions',
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
