// there is no null service needed, so always use the default implementation
import createNullService from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/NodesService';

import BaseServiceLocator from 'in-applications/FlowMap/serviceLocator/BaseServiceLocator';

export default class NodeServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  addNode(id, node) {
    return this.service.addNode(id, node);
  }

  getNodes() {
    return this.service.getNodes();
  }

  getNode(id) {
    return this.service.getNode(id);
  }

  removeNode(id) {
    return this.service.removeNode(id);
  }
}
