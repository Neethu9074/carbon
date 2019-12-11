import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/hazelcastCluster/kpiDefinitions';

import iconSvgPath from 'in-forge/plugins/hazelcastNode/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.hazelcastCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Hazelcast Cluster',
    plural: 'HazelcastClusters'
  }
});
