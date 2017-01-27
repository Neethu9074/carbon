import createNullService from 'in-map/misc/serviceLocator/cameraController/CameraControllerNullService';


const CameraControllerServiceLocator = (function create() {
  const nullService = createNullService();
  let service = nullService;

  function flyToPosition(position) {
    return service.flyToPosition(position);
  }

  function focusMap() {
    return service.focusMap();
  }

  function clampCameraPositionToVerticesDimensions() {
    return service.clampCameraPositionToVerticesDimensions();
  }

  function update(dt) {
    return service.update(dt);
  }

  function zoom(dz, centeredZoom) {
    return service.zoom(dz, centeredZoom);
  }

  function getRenderableCamera() {
    return service.getRenderableCamera();
  }

  function provide(_service) {
    if (service) {
      service.dispose();
    }

    if (!_service) {
      service = nullService;
      return;
    }

    _service.init();
    _service.initEvents();
    service = _service;
  }

  return {
    clampCameraPositionToVerticesDimensions,
    getRenderableCamera,
    flyToPosition,
    focusMap,
    zoom,
    update,
    provide
  };
}());

export default CameraControllerServiceLocator;
