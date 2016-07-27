import {createStore} from 'in-stores/store';


const frame = createStore({
  name: 'scene/requestedFrame',
  initialValue: 1
});
export const frame$ = frame.observable;

export function requestRendering() {
  frame.applyStateMutation(oldFrame => ++oldFrame);
}
