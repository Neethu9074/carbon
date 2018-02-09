import createNullService from 'in-components/FlowMap/serviceLocator/DataFetchingServiceLocator/NullService';
import BaseServiceLocator from 'in-components/FlowMap/serviceLocator/BaseServiceLocator';

export default class DataFetchingServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  init() {
    return this.service.init();
  }

  getDataForNode(id, direction) {
    return this.service.getDataForNode(id, direction);
  }

  disposeDataForNode(id) {
    return this.service.disposeDataForNode(id);
  }
}
