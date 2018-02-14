import createNullService from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/NullService';
import BaseServiceLocator from 'in-components/FlowMap/serviceLocator/BaseServiceLocator';

export default class ConnectionsServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  set(ids) {
    return this.service.set(ids);
  }

  remove(ids) {
    return this.service.remove(ids);
  }

  update() {
    return this.service.update();
  }
}
