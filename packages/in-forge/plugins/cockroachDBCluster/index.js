import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/cockroachDBCluster/kpiDefinitions';

import iconSvgPath from 'in-forge/plugins/cockroachDBNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.cockroachDBCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'CockroachDB Cluster',
    plural: 'CockroachDB Clusters'
  },
  technologyDescriptor: {
    label: 'CockroachDB'
  }
});
