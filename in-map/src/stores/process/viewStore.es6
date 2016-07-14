import {createStore} from 'in-stores/store';


const view = createStore({
  name: 'processView/2D3Dview',
  initialValue: '3D'
});
export const view$ = view.observable;

export function toggleView() {
  view.applyStateMutation(oldState => {
    if (oldState === '3D') {
      return '2D';
    }
    return '3D';
  });
}
