import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/logicalMsmqPublisherConnection/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
<<<<<<< HEAD
  plugin: plugins.logicalMsmqConsumerConnection,
=======
  plugin: plugins.logicalRabbitMqConsumerConnection,
>>>>>>> fc10f69... ADd plugins for MSMQ connections to forge

  iconSvgPath,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'MSMQ Consumer Connection',
    plural: 'MSMQ Consumer Connections'
  }
});
