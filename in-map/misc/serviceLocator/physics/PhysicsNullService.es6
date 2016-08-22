function noop() {}

const physicsNullService = {
  init: noop,
  checkRaycaster: noop,
  addCollisionObject: noop,
  removeCollisionObject: noop,
  dispose: noop
};
export default function createNullService() {
  return physicsNullService;
}
