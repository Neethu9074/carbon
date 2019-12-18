import metricDefinitions from 'in-forge/plugins/cassandraCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cassandraCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/cassandraNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,
  pluginName: {
    singular: 'Cassandra Cluster',
    plural: 'Cassandra Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Cassandra'
  }
});
