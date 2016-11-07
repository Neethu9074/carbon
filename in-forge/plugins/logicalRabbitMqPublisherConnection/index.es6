import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalRabbitMqPublisherConnection,
  icon,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Rabbit MQ Publisher Connection',
    plural: 'Rabbit MQ Publisher Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
