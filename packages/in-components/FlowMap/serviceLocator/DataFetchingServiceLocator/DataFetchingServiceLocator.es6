import createNullService from 'in-components/FlowMap/serviceLocator/DataFetchingServiceLocator/NullService';
import BaseServiceLocator from 'in-components/FlowMap/serviceLocator/BaseServiceLocator';

export default class DataFetchingServiceLocator extends BaseServiceLocator {
  constructor(sceneGraph) {
    super(createNullService);
    this.sceneGraph = sceneGraph;
  }

  getRootNodeData() {
    return this.service.getRootNodeData();
  }

  getIconTypeForNodeId(id) {
    return this.service.getIconTypeForNodeId(id);
  }

  getIncomingFlowNodes$(nodeId) {
    this.sceneGraph.getFlowNodes$(nodeId, 'incoming', this.service.getIncomingFlowNodes$);
  }

  getOutgoingFlowNodes$(nodeId) {
    this.sceneGraph.getFlowNodes$(nodeId, 'outgoing', this.service.getOutgoingFlowNodes$);
  }

  getOutgoingFlowNodesForChild$(nodeId, childId) {
    this.sceneGraph.getFlowNodesForChild$(nodeId, childId, 'outgoing', this.service.getOutgoingFlowNodes$);
  }

  getIncomingFlowNodesForChild$(nodeId, childId) {
    this.sceneGraph.getFlowNodesForChild$(nodeId, childId, 'incoming', this.service.getIncomingFlowNodes$);
  }

  getMetrics$(nodeId, childId) {
    return this.service.getMetrics$(nodeId, childId);
  }

  getNode$(id) {
    return this.service.getNode$(id);
  }
}
