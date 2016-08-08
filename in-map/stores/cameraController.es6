import {createStore} from 'in-stores/store';


const cameraController = createStore({
  name: 'map/cameraController',
  initialValue: null
});
export const cameraController$ = cameraController.observable;


export function setCameraController(controller) {
  cameraController.applyStateMutation(() => controller);
}
