import metricDefinitions from 'in-forge/plugins/redisCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/redisCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/redis/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redisCluster,
  pluginName: {
    singular: 'Redis Cluster',
    plural: 'Redis Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Redis'
  }
});
