import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/cockroachDBNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.cockroachDBCluster,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'CockroachDB Cluster',
    plural: 'CockroachDB Clusters'
  },
  technologyDescriptor: {
    label: 'CockroachDB'
  }
});
