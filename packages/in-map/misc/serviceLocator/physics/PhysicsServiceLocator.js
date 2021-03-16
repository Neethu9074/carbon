/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createNullService from 'in-map/misc/serviceLocator/physics/PhysicsNullService';

const PhysicsServiceLocator = (function create() {
  const nullService = createNullService();
  let service = nullService;

  function init() {
    return service.init();
  }

  function checkRaycaster(raycaster) {
    return service.checkRaycaster(raycaster);
  }

  function addCollisionObject(object, layerId) {
    return service.addCollisionObject(object, layerId);
  }

  function removeCollisionObject(object, layerId) {
    return service.removeCollisionObject(object, layerId);
  }

  function updateCollisionObject(object, layerId) {
    return service.updateCollisionObject(object, layerId);
  }

  function dispose() {
    return service.dispose();
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
    service = _service;
  }

  return {
    init,
    provide,
    checkRaycaster,
    addCollisionObject,
    updateCollisionObject,
    removeCollisionObject,
    dispose
  };
})();

export default PhysicsServiceLocator;
