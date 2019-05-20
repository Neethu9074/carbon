import createNullService from 'in-components/FlowMap/serviceLocator/ConnectionsServiceLocator/NullService';
import BaseServiceLocator from 'in-components/FlowMap/serviceLocator/BaseServiceLocator';

export default class ConnectionsServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  remove(ids) {
    return this.service.remove(ids);
  }

  update(nodesMap) {
    return this.service.update(nodesMap);
  }
}
