import * as ro from 'reactive-observables';

import {createStore} from 'in-stores/store';


const frame = createStore({
  name: 'map/frame',
  initialValue: 0
});
export const frame$ = frame.observable;

export function renderFrame() {
  frame.applyStateMutation(oldFrame => oldFrame + 1);
}


export const renderSignal = ro.create({emitLatestOnSubscribe: false});
renderSignal.nextFrame()
            .subscribe(() => renderFrame());

export function requestRendering() {
  renderSignal.emit(true);
}
