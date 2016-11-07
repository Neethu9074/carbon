import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/logicalRabbitMqPublisherConnection/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalRabbitMqConsumerConnection,
  icon,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Rabbit MQ Consumer Connection',
    plural: 'Rabbit MQ Consumer Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
