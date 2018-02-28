import { uniq } from 'lodash';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';

export default class Child extends SceneObject {
  constructor(serviceLocatorUid, nodeId, nodeOriginalId, id) {
    super(id, serviceLocatorUid);
    this.nodeId = nodeId;
    this.nodeOriginalId = nodeOriginalId;
    this.outgoing = [];
    this.incoming = [];
  }

  setData(data) {
    this.events$.emit('data', data);
  }

  setIsExpanded(isIncomingExpanded, direction) {
    this.events$.emit(`isExpanded_${direction}`, isIncomingExpanded);
  }

  expandRight() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.fetchOutgoingDataForChildId(
      this.nodeId,
      this.id
    );
  }

  expandLeft() {
    getServiceLocators(this.serviceLocatorUid).dataFetchingServiceLocator.fetchIncomingDataForChildId(
      this.nodeId,
      this.id
    );
  }

  addConnected(ids, direction) {
    this[direction] = uniq(this[direction].concat(ids));
  }

  dispose() {
    super.dispose();
  }
}
