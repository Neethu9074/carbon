import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';


registerSnapshotDefinition({
  plugin: plugins.messageBrokerServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Message Broker Instance',
    plural: 'Message Broker Instances'
  },

  chartWiggleRoom: 20000,

  getIconPath(snapshot) {
    const messageBrokerType = snapshot.getIn(['data', 'physical_endpoint', 'type'], '');
    if (messageBrokerType.match(/kafka/i)) {
      return plugins.kafka;
    } else if (messageBrokerType.match(/rabbitmq/i)) {
      return plugins.rabbitmq;
    }
    return plugins.logicalMessageBroker;
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
