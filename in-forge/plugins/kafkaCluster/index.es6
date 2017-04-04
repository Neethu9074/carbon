import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/kafka/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kafkaCluster,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.kafkaCluster, 'Kafka Cluster', 'Kafka Cluster');

addSearchableEntityType('kafkaCluster', plugins.kafkaCluster);
