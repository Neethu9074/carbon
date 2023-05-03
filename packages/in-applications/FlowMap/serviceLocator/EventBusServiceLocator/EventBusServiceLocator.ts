/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// there is no null service needed, so always use the default implementation
import createNullService from 'in-applications/FlowMap/serviceLocator/EventBusServiceLocator/EventBusService';
import BaseServiceLocator from 'in-applications/FlowMap/serviceLocator/BaseServiceLocator';

export default class EventBusServiceLocator extends BaseServiceLocator<any> {
  constructor() {
    super(createNullService);
  }

  emit(msg: string, payload: boolean) {
    return this.service.emit(msg, payload);
  }

  on(msg: string) {
    return this.service.on(msg);
  }
}
