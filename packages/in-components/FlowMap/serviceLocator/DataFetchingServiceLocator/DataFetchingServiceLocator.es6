import createNullService from 'in-components/FlowMap/serviceLocator/DataFetchingServiceLocator/NullService';
import BaseServiceLocator from 'in-components/FlowMap/serviceLocator/BaseServiceLocator';

export default class DataFetchingServiceLocator extends BaseServiceLocator {
  constructor(sceneGraph) {
    super(createNullService);
    this.sceneGraph = sceneGraph;
  }

  getRootNodeData() {
    return this.service.getRootNodeData ? this.service.getRootNodeData() : null;
  }

  getIconTypeForNodeId(id) {
    return this.service.getIconTypeForNodeId(id);
  }

  fetchIncomingDataForNodeId(id) {
    this.sceneGraph.fetchIncomingDataForNodeId(id, this.service.getIncomingDataForNodeId);
  }

  fetchOutgoingDataForNodeId(id) {
    this.sceneGraph.fetchOutgoingDataForNodeId(id, this.service.getOutgoingDataForNodeId);
  }

  fetchMetricsForNodeId(id) {
    return this.service.fetchMetricsForNodeId(id);
  }

  disposeOpenDataSubscriptionsForNodeId(id) {
    this.sceneGraph.disposeOpenDataSubscriptionsForNodeId(id);
  }
}
