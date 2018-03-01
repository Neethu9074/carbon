import { uniq } from 'lodash';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';
import Subscriber from 'in-map/misc/Subscriber';

export default class Child extends SceneObject {
  constructor(serviceLocatorUid, nodeId, nodeOriginalId, id, metricValues) {
    super(id, serviceLocatorUid);
    this.nodeId = nodeId;
    this.nodeOriginalId = nodeOriginalId;
    this.outgoing = [];
    this.incoming = [];

    if (metricValues) {
      this.events$.emit('metricValues', metricValues);
    }
    this.initSubscriptions(metricValues);
  }

  initSubscriptions(metricValues) {
    this.subscriber = new Subscriber();
    if (!metricValues) {
      this.subscriber.addSubscription(
        getServiceLocators(this.serviceLocatorUid)
          .dataFetchingServiceLocator.fetchMetricsForChildId(this.id)
          .map(result => {
            if (!result.progress.loading) {
              return result.data;
            }
            return null;
          })
          .subscribe(metrics => {
            this.events$.emit('metricValues', metrics || null);
          })
      );
    }
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
