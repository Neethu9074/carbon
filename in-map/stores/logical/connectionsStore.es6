import createCollection from 'in-map/stores/ObjectColletionStream';
import {createStore} from 'in-stores/store';


const connections = createCollection();
export default connections;


const showSticky = createStore({
  name: 'logical/connectionSticky/isibility',
  initialValue: false
});
export const showSticky$ = showSticky.observable;

export function setShowSticky(stickiesAreShown) {
  showSticky.applyStateMutation(() => stickiesAreShown);
}
