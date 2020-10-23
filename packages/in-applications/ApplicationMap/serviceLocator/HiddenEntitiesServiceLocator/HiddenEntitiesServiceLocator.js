import createService from 'in-applications/ApplicationMap/serviceLocator/HiddenEntitiesServiceLocator/HiddenEntitiesService';
import BaseServiceLocator from 'in-applications/ApplicationMap/serviceLocator/BaseServiceLocator';

export default class HiddenEntitiesServiceLocator extends BaseServiceLocator {
  constructor(eventBusServiceLocator, nodesServiceLocator, connectionsServiceLocator) {
    super(() => createService(eventBusServiceLocator, nodesServiceLocator, connectionsServiceLocator));
  }

  setHoveredNodeId(id) {
    return this.service.setHoveredNodeId(id);
  }

  setSelectedNodeId(id) {
    return this.service.setSelectedNodeId(id);
  }

  getResolvedId$() {
    return this.service.getResolvedId$();
  }
}
