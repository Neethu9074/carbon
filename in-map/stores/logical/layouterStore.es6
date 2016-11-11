import {create} from 'reactive-observables';
import Immutable from 'immutable';

import FruchtermannReingold from 'in-map/misc/logical/layoutingStrategies/FruchtermannReingold';
import Vizceral from 'in-map/misc/logical/layoutingStrategies/Vizceral';
import {always} from 'in-services/fixedStreams';
import {createStore} from 'in-stores/store';


const nodePositions = createStore({
  name: 'logical/nodePositions',
  initialValue: Immutable.fromJS({})
});

export const nodePositions$ = nodePositions.observable.distinct();


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
    if (value) {
      nodes = nodes.set(id, value);
    } else {
      nodes = nodes.delete(id);
    }

    return nodes;
  });
}


export const fruchtermannReingoldLayouting$ = nodePositions$.map(storedNodePositions => {
  return {
    applyLayout: FruchtermannReingold,
    config: {
      storedNodePositions
    }
  };
});

export const vizceralLayouting$ = always({
  applyLayout: Vizceral,
  config: {}
});

export const vizceralLayoutingWithSubgraphs$ = always({
  applyLayout: Vizceral,
  config: {
    createSubgraphs: true
  }
});


export const currentLayoutingStrategy$ = create().emit(fruchtermannReingoldLayouting$);

export function setLayoutingStrategy(newLayouting$) {
  currentLayoutingStrategy$.emit(newLayouting$);
}
