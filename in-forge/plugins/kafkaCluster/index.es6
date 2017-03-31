import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/kafka/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kafkaCluster,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.kafkaCluster, 'Kafka Cluster', 'Kafka Cluster');

addLabelFinder(plugins.kafkaCluster, snapshot => 'Kafka @ ' + snapshot.getIn(['data', 'groupId']));

addSearchableEntityType('kafkaCluster', plugins.kafkaCluster);
