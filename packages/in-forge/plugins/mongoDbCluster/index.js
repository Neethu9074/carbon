import metricDefinitions from 'in-forge/plugins/mongoDbCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mongoDbCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mongoDbCluster,
  pluginName: {
    singular: 'MongoDB Atlas Cluster',
    plural: 'MongoDB Atlas Cluster'
  },
  kpiDefinitions,
  metricDefinitions
});
