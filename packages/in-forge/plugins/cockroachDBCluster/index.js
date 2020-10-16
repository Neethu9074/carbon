import metricDefinitions from 'in-forge/plugins/cockroachDBCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cockroachDBCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cockroachDBCluster,
  pluginName: {
    singular: 'CockroachDB Cluster',
    plural: 'CockroachDB Clusters'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'CockroachDB'
  }
});
