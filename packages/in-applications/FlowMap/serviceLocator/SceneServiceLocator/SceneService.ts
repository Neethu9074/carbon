/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

interface SceneService {
  getScene: () => MainScene;
  dispose: () => void;
}

export default function createSceneService(scene: MainScene): SceneService {
  function getScene() {
    return scene;
  }

  function dispose() {}

  return {
    getScene,
    dispose
  };
}
