import createNullService from 'in-map/misc/serviceLocator/cameraController/CameraControllerNullService';


const CameraControllerServiceLocator = (function create() {
  let service = createNullService();

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
    if (!_service) {
      return;
    }

    if (service) {
      service.dispose();
    }

    if (_service) {
      _service.init();
      _service.initEvents();
    }

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
