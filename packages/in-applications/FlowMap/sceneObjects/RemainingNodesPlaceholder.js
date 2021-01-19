/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Node from 'in-applications/FlowMap/sceneObjects/Node';

export default class RemainingNodesPlaceholder extends Node {
  constructor(serviceLocatorUid, id) {
    super(serviceLocatorUid, id);

    this.isRemainingNodesPlaceHolder = true;
  }

  setPaginationInformation(paginationInformation) {
    this.events$.emit('paginationInformation', paginationInformation);
  }
}
