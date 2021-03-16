/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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

  function zoomIn() {
    return service.zoomIn();
  }

  function zoomOut() {
    return service.zoomOut();
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
    provide,
    zoomOut,
    zoomIn,
    update
  };
})();

export default CameraControllerServiceLocator;
