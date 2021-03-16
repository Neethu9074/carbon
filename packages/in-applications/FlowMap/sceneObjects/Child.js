/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import FlowMapBaseEntity from 'in-applications/FlowMap/sceneObjects/FlowMapBaseEntity';

export default class Child extends FlowMapBaseEntity {
  constructor(parentNode, id) {
    super(parentNode.serviceLocatorUid, id);

    this.parentNode = parentNode;

    this.initSubscriptions();
  }
}
