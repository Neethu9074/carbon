import {create} from 'reactive-observables';
import {fromJS} from 'immutable';

import FruchtermannReingold from 'in-map/misc/logical/layoutingStrategies/FruchtermannReingold';
import Vizceral from 'in-map/misc/logical/layoutingStrategies/Vizceral';
import {setIn, getIn} from 'in-services/settings';
import {always} from 'in-services/fixedStreams';
import {createStore} from 'in-stores/store';


const nodePositions = createStore({
  name: 'logical/nodePositions',
  initialValue: fromJS({})
});

export const nodePositions$ = nodePositions.observable.distinct();


export function changePosition(id, x, y, z) {
  set(id, {x, y, z, timestamp: Date.now()});
}

export function removeId(id) {
  set(id, null);
}

export function clearAll() {
  nodePositions.applyStateMutation(() => fromJS({}));
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


const layouterSettingsPath = ['map', 'logical', 'layouter'];
export const currentLayoutingStrategy$ = create();
getIn(layouterSettingsPath).once(storedLayouter => {
  if (storedLayouter === 'flow') {
    currentLayoutingStrategy$.emit(vizceralLayouting$);
  } else if(storedLayouter === 'fruchtermann') {
    currentLayoutingStrategy$.emit(fruchtermannReingoldLayouting$);
  }
});

export function setLayoutingStrategy(newLayouting$) {
  currentLayoutingStrategy$.emit(newLayouting$);
  if (newLayouting$ === vizceralLayouting$) {
    setIn(layouterSettingsPath, 'flow');
  } else if(newLayouting$ === fruchtermannReingoldLayouting$) {
    setIn(layouterSettingsPath, 'fruchtermann');
  }
}
