import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/logicalRabbitMqPublisherConnection/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.logicalRabbitMqConsumerConnection,

  iconSvgPath,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Rabbit MQ Consumer Connection',
    plural: 'Rabbit MQ Consumer Connections'
  }
});
