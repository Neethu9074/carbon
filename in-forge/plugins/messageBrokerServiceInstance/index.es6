import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.messageBrokerServiceInstance,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Message Broker Instance',
    plural: 'Message Broker Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  },

  getIcon(snapshot) {
    let type = snapshot.get('plugin');

    const messageBrokerPlugin = plugins.messageBrokerServiceInstance;
    if (type === messageBrokerPlugin) {
      type = messageBrokerPlugin;
      const messageBrokerType = snapshot.getIn(['data', 'physical_endpoint', 'type']);

      if (messageBrokerType) {
        if (messageBrokerType.match(/kafka/i)) {
          return plugins.kafka;
        } else if (messageBrokerType.match(/rabbitmq/i)) {
          return plugins.rabbitmq;
        }
      }
    }

    return type;
  }
});
