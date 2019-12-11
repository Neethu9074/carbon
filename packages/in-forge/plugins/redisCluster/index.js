import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/redisCluster';
import iconSvgPath from 'in-forge/plugins/redis/iconPath';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.redisCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Redis Cluster',
    plural: 'Redis Clusters'
  },
  technologyDescriptor: {
    label: 'Redis'
  }
});
