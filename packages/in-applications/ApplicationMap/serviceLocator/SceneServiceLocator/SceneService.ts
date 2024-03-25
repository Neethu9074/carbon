/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

interface SceneService {
  getScene: () => _Scene;
  dispose: () => void;
}

export default function createSceneService(scene: _Scene): SceneService {
  function getScene() {
    return scene;
  }

  function dispose() {}

  return {
    getScene,
    dispose
  };
}
