import metricDefinitions from 'in-forge/plugins/cockroachDBCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/cockroachDBCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/cockroachDBNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.cockroachDBCluster,
  pluginName: {
    singular: 'CockroachDB Cluster',
    plural: 'CockroachDB Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'CockroachDB'
  }
});
