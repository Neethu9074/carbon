import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/cassandraCluster/kpiDefinitions';

import iconSvgPath from 'in-forge/plugins/cassandraNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Cassandra Cluster',
    plural: 'Cassandra Clusters'
  },
  technologyDescriptor: {
    label: 'Cassandra'
  }
});
