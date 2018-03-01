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

  fetchIncomingDataForNodeId(nodeId) {
    this.sceneGraph.fetchIncomingDataForNodeId(nodeId, this.service.getIncomingDataForNodeId);
  }

  fetchOutgoingDataForNodeId(nodeId) {
    this.sceneGraph.fetchOutgoingDataForNodeId(nodeId, this.service.getOutgoingDataForNodeId);
  }

  fetchOutgoingDataForChildId(nodeId, childId) {
    this.sceneGraph.fetchOutgoingDataForChildId(nodeId, childId, this.service.getOutgoingDataForNodeId);
  }

  fetchIncomingDataForChildId(nodeId, childId) {
    this.sceneGraph.fetchIncomingDataForChildId(nodeId, childId, this.service.getIncomingDataForNodeId);
  }

  fetchMetricsForNodeId(id) {
    return this.service.fetchMetricsForNodeId(id);
  }

  fetchMetricsForChildId(id) {
    return this.service.fetchMetricsForChildId(id);
  }

  fetchNodeById(id) {
    return this.service.fetchNodeById(id);
  }

  disposeOpenDataSubscriptionsForNodeId(id) {
    this.sceneGraph.disposeOpenDataSubscriptionsForNodeId(id);
  }
}
