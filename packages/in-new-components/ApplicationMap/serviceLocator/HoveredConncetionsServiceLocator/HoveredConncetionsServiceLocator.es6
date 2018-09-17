import createService from 'in-new-components/ApplicationMap/serviceLocator/HoveredConncetionsServiceLocator/HoveredConncetionsService';
import BaseServiceLocator from 'in-new-components/ApplicationMap/serviceLocator/BaseServiceLocator';

export default class HoveredConncetionsServiceLocator extends BaseServiceLocator {
  constructor(eventBusServiceLocator, connectionsServiceLocator, sceneServiceLocator) {
    super(() => createService(eventBusServiceLocator, connectionsServiceLocator, sceneServiceLocator));
  }

  getHoveredConnection$(id) {
    return this.service.getHoveredConnection$(id);
  }

  setClickedConnection(connection) {
    return this.service.setClickedConnection(connection);
  }
}
