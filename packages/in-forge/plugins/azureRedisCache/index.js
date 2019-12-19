import metricDefinitions from 'in-forge/plugins/azureRedisCache/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureRedisCache/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/azureRedisCache/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureRedisCache,
  pluginName: {
    singular: 'Azure Redis Cache',
    plural: 'Azure Redis Caches'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
