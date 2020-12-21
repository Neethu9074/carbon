import { create } from '@instana/observables';

import { requestRendering } from 'in-map/stores/renderingStore';

export const scene$ = create();

export function setScene(newScene) {
  scene$.emit(newScene);
}

export function clear() {
  scene$.emit(null);
}

export function addSceneObject(object) {
  scene$.once(_scene => {
    if (_scene) {
      _scene.scene.add(object);
      requestRendering();
    }
  });
}

export function removeSceneObject(object) {
  scene$.once(_scene => {
    if (_scene) {
      _scene.scene.remove(object);
      requestRendering();
    }
  });
}
