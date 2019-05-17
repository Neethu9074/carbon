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
