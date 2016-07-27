import {createStore} from 'in-stores/store';


const requestedFrame = createStore({
  name: 'scene/requestedFrame',
  initialValue: 0
});
export const requestedFrame$ = requestedFrame.observable;

export function requestFrame() {
  requestedFrame.applyStateMutation(frame => frame++);
}
