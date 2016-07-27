import {createStore} from 'in-stores/store';


const canvas = createStore({
  name: 'index/canvas',
  initialValue: null
});
export const canvas$ = canvas.observable;

export function setCanvas(newCanvas) {
  canvas.applyStateMutation(() => newCanvas);
}
