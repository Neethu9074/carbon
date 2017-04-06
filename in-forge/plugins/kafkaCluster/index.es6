import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/kafka/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kafkaCluster,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kafka Cluster',
    plural: 'Kafka Cluster'
  }
});
