import createNullService from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/NullService';
import BaseServiceLocator from 'in-components/FlowMap/serviceLocator/BaseServiceLocator';

export default class ConnectionsServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  addOrSet(id, connection) {
    return this.service.addOrSet(id, connection);
  }

  remove(id) {
    return this.service.remove(id);
  }

  update() {
    return this.service.update();
  }
}
