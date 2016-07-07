import {requestRendering} from 'in-map/src/stores/renderingStore';
import {createStore} from 'in-stores/store';


const scene = createStore({
  name: 'map/scene',
  initialValue: null
});
export const scene$ = scene.observable;


export function setScene(newScene) {
  scene.applyStateMutation(() => newScene);
}

export function addSceneObject(object) {
  scene$.once(_scene => {
    if (_scene.scene) {
      _scene.scene.add(object);
      requestRendering();
    }
  });
}

export function removeSceneObject(object) {
  scene$.once(_scene => {
    if (_scene.scene) {
      _scene.scene.remove(object);
      requestRendering();
    }
  });
}
