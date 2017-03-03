import createCollection from 'in-map/stores/ObjectCollectionStream';
import {createStore} from 'in-stores/store';


export const nodes = createCollection();

const showSticky = createStore({
  name: 'physical/nodesSticky/isVibility',
  initialValue: false
});
export const showSticky$ = showSticky.observable;

export function setShowSticky(stickiesAreShown) {
  showSticky.applyStateMutation(() => stickiesAreShown);
}
