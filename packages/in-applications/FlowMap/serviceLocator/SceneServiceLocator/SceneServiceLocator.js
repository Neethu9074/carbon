/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createNullService from 'in-applications/FlowMap/serviceLocator/SceneServiceLocator/NullService';
import BaseServiceLocator from 'in-applications/FlowMap/serviceLocator/BaseServiceLocator';

export default class SceneServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  getScene() {
    return this.service.getScene();
  }
}
