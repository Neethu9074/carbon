import Node from 'in-components/FlowMap/sceneObjects/Node';

export default class RemainingNodesPlaceholder extends Node {
  constructor(serviceLocatorUid, id) {
    super(serviceLocatorUid, id);

    this.isRemainingNodesPlaceHolder = true;
  }

  setPaginationInformation(paginationInformation) {
    this.events$.emit('paginationInformation', paginationInformation);
  }
}
