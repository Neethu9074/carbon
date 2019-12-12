import metricDefinitions from 'in-forge/plugins/couchbaseCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/couchbaseCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/couchbaseNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.couchbaseCluster,
  pluginName: {
    singular: 'Couchbase Cluster',
    plural: 'Couchbase Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
