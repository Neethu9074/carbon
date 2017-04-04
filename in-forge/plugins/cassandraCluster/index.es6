import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/cassandraNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.cassandraCluster, 'Cassandra Cluster', 'Cassandra Cluster');

addSearchableEntityType('cassandraCluster', plugins.cassandraCluster);
