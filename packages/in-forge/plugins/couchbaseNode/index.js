import metricDefinitions from 'in-forge/plugins/couchbaseNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/couchbaseNode/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/couchbaseNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.couchbaseNode,
  pluginName: {
    singular: 'Couchbase Node',
    plural: 'Couchbase Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
