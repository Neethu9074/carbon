/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Subject } from '@instana/observables';

// there is no null service needed, so always use the default implementation
import createNullService, {
  EventBusService
} from 'in-applications/FlowMap/serviceLocator/EventBusServiceLocator/EventBusService';
import BaseServiceLocator from 'in-applications/FlowMap/serviceLocator/BaseServiceLocator';

export default class EventBusServiceLocator<Topics extends Record<string, boolean>> extends BaseServiceLocator<
  EventBusService<Topics>
> {
  constructor() {
    super(createNullService);
  }

  emit<Topic extends keyof Topics>(msg: Extract<Topic, string>, payload: Topics[Topic]) {
    return this.service.emit(msg, payload);
  }

  on<Topic extends keyof Topics>(msg: Extract<Topic, string>): Subject<Topics[Topic]> {
    return this.service.on(msg);
  }
}
