import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/logicalKafkaPublisherConnection/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.logicalKafkaConsumerConnection,

  iconSvgPath,
  metricDefinitions,

  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'Kafka Consumer Connection',
    plural: 'Kafka Consumer Connections'
  }
});
