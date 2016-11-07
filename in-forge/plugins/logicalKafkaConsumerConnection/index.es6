import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/logicalKafkaPublisherConnection/icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalKafkaConsumerConnection,
  icon,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Kafka Consumer Connection',
    plural: 'Kafka Consumer Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
