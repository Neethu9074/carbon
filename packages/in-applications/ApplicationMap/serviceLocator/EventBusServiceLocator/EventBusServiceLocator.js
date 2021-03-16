/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// there is no null service needed, so always use the default implementation
import createNullService from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import BaseServiceLocator from 'in-applications/ApplicationMap/serviceLocator/BaseServiceLocator';

export default class EventBusServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  emit(msg, payload) {
    return this.service.emit(msg, payload);
  }

  on(msg) {
    return this.service.on(msg);
  }
}
