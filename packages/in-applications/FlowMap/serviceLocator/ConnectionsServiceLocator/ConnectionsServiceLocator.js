/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createNullService from 'in-applications/FlowMap/serviceLocator/ConnectionsServiceLocator/NullService';
import BaseServiceLocator from 'in-applications/FlowMap/serviceLocator/BaseServiceLocator';

export default class ConnectionsServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  remove(ids) {
    return this.service.remove(ids);
  }

  update(nodesMap) {
    return this.service.update(nodesMap);
  }
}
