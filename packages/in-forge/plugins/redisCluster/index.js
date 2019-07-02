import { plugins } from 'in-forge/constants';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';

import iconSvgPath from 'in-forge/plugins/redis/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.redisCluster,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Redis Cluster',
    plural: 'Redis Clusters'
  },
  technologyDescriptor: {
    label: 'Redis'
  }
});
