import * as ro from 'reactive-observables';

import {requestRendering} from 'in-map/src/stores/renderingStore';


export const scene$ = ro.create();

export function setScene(newScene) {
  scene$.emit(newScene);
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
