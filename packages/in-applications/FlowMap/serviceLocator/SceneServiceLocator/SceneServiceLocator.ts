/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error will migrate in future commit
import createNullService from 'in-applications/FlowMap/serviceLocator/SceneServiceLocator/NullService';
import BaseServiceLocator from 'in-applications/FlowMap/serviceLocator/BaseServiceLocator';

export default class SceneServiceLocator extends BaseServiceLocator<any> {
  constructor() {
    super(createNullService);
  }

  getScene() {
    return this.service.getScene();
  }
}
