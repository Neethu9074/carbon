import metricDefinitions from 'in-forge/plugins/hazelcastCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/hazelcastCluster/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/hazelcastNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.hazelcastCluster,
  pluginName: {
    singular: 'Hazelcast Cluster',
    plural: 'HazelcastClusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
