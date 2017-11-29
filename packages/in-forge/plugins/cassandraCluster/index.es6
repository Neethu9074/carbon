import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/cassandraNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Cassandra Cluster',
    plural: 'Cassandra Clusters'
  }
});
