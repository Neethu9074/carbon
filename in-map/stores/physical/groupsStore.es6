import createCollection from 'in-map/stores/ObjectCollectionStream';
import {createStore} from 'in-stores/store';


export const groups = createCollection();


const showSticky = createStore({
  name: 'physical/groupSticky/isibility',
  initialValue: true
});
export const showSticky$ = showSticky.observable;

export function setShowSticky(stickiesAreShown) {
  showSticky.applyStateMutation(() => stickiesAreShown);
}
