function noop() {}

const physicsNullService = {
  init: noop,
  initEvents: noop,
  flyToPosition: noop,
  focusMap: noop,
  update: noop,
  dispose: noop
};
export default function createNullService() {
  return physicsNullService;
}
