import {combineLatest} from 'reactive-observables';

import {edges$} from 'in-map/src/stores/process/edgesStore';
import {nodes$} from 'in-map/src/stores/process/nodesStore';
import {eventBus} from 'in-map/src/services/eventBus';
import {createStore} from 'in-stores/store';


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


export const inventar$ = combineLatest([nodes$, edges$])
                         .map(([nodes, edges]) => {
                           return {
                             nodes: Object.keys(nodes).map(key => nodes[key]),
                             edges: Object.keys(edges).map(key => edges[key])
                           };
                         });
