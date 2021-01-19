/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default function createSceneService(scene) {
  function getScene() {
    return scene;
  }

  function dispose() {}

  return {
    getScene,
    dispose
  };
}
