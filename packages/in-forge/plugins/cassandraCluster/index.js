import metricDefinitions from 'in-forge/plugins/cassandraCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cassandraCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cassandraCluster,
  pluginName: {
    singular: 'Cassandra Cluster',
    plural: 'Cassandra Clusters'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Cassandra'
  }
});
