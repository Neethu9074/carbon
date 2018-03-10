import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import FlowMapBaseEntity from 'in-components/FlowMap/sceneObjects/FlowMapBaseEntity';
import { find } from 'in-services/arrayUtils';

export default class Child extends FlowMapBaseEntity {
  constructor(parentNode, id, metricValues) {
    super(parentNode.serviceLocatorUid, id, metricValues);

    this.parentNode = parentNode;

    this.initSubscriptions(metricValues);
  }

  addConnected(child, direction) {
    const contains = find(
      this[direction],
      _child => _child.parentNode.id === child.parentNode.id && _child.id === child.id
    );
    if (!contains) {
      this[direction].push(child);
      this.setIsExpanded(true, direction);
    }
  }

  getMetrics(dataFetchingServiceLocator) {
    return dataFetchingServiceLocator.getMetrics$(this.parentNode.id, this.id);
  }

  expandRight() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.getOutgoingFlowNodesForChild$(
      this.parentNode.id,
      this.id
    );
  }

  expandLeft() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.getIncomingFlowNodesForChild$(
      this.parentNode.id,
      this.id
    );
  }

  disposeSubscriptions() {
    const dataFetchingServiceLocator = getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator;
    dataFetchingServiceLocator.disposeOpenDataSubscriptionsForNodeId(`${this.parentNode.id}__${this.id}`);
  }

  dispose() {
    super.dispose();

    this.disposeSubscriptions();
  }
}
