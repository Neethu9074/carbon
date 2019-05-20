import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.azureRedisCache,
  pluginName: {
    singular: 'Azure Redis Cache',
    plural: 'Azure Redis Caches'
  },
  iconSvgPath,
  metricDefinitions
});
