import metricDefinitions from 'in-forge/plugins/couchbaseCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/couchbaseCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.couchbaseCluster,
  pluginName: {
    singular: 'Couchbase Cluster',
    plural: 'Couchbase Clusters'
  },
  kpiDefinitions,
  metricDefinitions
});
