function noop() {}

const nullService = {
  getScene: () => ({ addSceneObject: noop, removeSceneObject: noop, requestRendering: noop }),
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
