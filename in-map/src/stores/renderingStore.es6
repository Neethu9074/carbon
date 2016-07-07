import {createStore} from 'in-stores/store';


const frame = createStore({
  name: 'map/frame',
  initialValue: 0
});
export const frame$ = frame.observable;

export function requestRendering() {
  frame.applyStateMutation(oldFrame => oldFrame + 1);
}
