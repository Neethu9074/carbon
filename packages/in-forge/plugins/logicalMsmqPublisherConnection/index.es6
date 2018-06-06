import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
<<<<<<< HEAD
  plugin: plugins.logicalMsmqPublisherConnection,
=======
  plugin: plugins.logicalRabbitMqPublisherConnection,
>>>>>>> fc10f69... ADd plugins for MSMQ connections to forge

  iconSvgPath,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
<<<<<<< HEAD
    singular: 'MSMQ Publisher Connection',
    plural: 'MSMQ Publisher Connections'
=======
    singular: 'Rabbit MQ Publisher Connection',
    plural: 'Rabbit MQ Publisher Connections'
>>>>>>> fc10f69... ADd plugins for MSMQ connections to forge
  }
});
