/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createNullService from 'in-applications/ApplicationMap/serviceLocator/ConnectionsServiceLocator/ConnectionsService';
import BaseServiceLocator from 'in-applications/ApplicationMap/serviceLocator/BaseServiceLocator';

export default class ConnectionsServiceLocator extends BaseServiceLocator {
  constructor(serviceLocatorUid, eventBusServiceLocator) {
    super(() => createNullService(serviceLocatorUid, eventBusServiceLocator));
  }

  update(nodes) {
    return this.service.update(nodes);
  }

  updateAllConnectionPositions() {
    return this.service.updateAllConnectionPositions();
  }

  getConnections() {
    return this.service.getConnections();
  }

  getConnections$() {
    return this.service.getConnections$();
  }

  initSubscriptions(hiddenEntitiesServiceLocator) {
    return this.service.initSubscriptions(hiddenEntitiesServiceLocator);
  }
}
