function noop() {}

const physicsNullService = {
  init: noop,
  initEvents: noop,
  flyToPosition: noop,
  focusMap: noop,
  getRenderableCamera: noop,
  clampCameraPositionToVerticesDimensions: noop,
  zoomOut: noop,
  zoomIn: noop,
  update: noop,
  dispose: noop
};
export default function createNullService() {
  return physicsNullService;
}
