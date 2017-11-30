import { createStore } from 'in-stores/store';

const showSticky = createStore({
  name: 'logical/connectionSticky/isibility',
  initialValue: false
});
export const showSticky$ = showSticky.observable;

export function setShowSticky(stickiesAreShown) {
  showSticky.applyStateMutation(() => stickiesAreShown);
}
