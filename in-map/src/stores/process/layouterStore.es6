import {combineLatest} from 'reactive-observables';

import {createStore, createTrackingStore} from 'in-stores/store';
import {nodes$} from 'in-map/src/stores/process/nodesStore';
import {edges$} from 'in-map/src/stores/process/edgesStore';
import eventBus from 'in-map/src/eventbus';


const layoutingEnabled = createStore({
  name: 'processViewEnableLayouterStore',
  initialValue: true
});
export const layoutingEnabled$ = layoutingEnabled.observable;

export function disableLayouting() {
  layoutingEnabled.applyStateMutation(() => false);
}

export function enableLayouting() {
  layoutingEnabled.applyStateMutation(() => true);
}

export function toggleLayouting() {
  layoutingEnabled.applyStateMutation(oldState => !oldState);
}

// when something is dragged, disable automatic layouting
eventBus.on('dragObjectStop').subscribe(id => {
  // if something was dropped, stop layouting
  if (id) {
    disableLayouting();
  }
});


export const inventar$ = createTrackingStore({
  name: 'processViewInventarStore',
  observable: combineLatest([nodes$, edges$])
                .map(props => {
                  const nodes = props[0];
                  const edges = props[1];

                  return {
                    nodes: Object.keys(nodes).map(key => nodes[key]),
                    edges: Object.keys(edges).map(key => edges[key])
                  };
                })
}).observable;
