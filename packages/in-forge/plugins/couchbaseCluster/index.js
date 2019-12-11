import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/couchbaseCluster/kpiDefinitions';

import iconSvgPath from 'in-forge/plugins/couchbaseNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.couchbaseCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Couchbase Cluster',
    plural: 'Couchbase Clusters'
  }
});
